import {makeAutoObservable, runInAction} from "mobx";
import { agent } from "../App/agent";
import { TournamentFormValues, Tournament } from "../App/Interfaces/Tournament";
import { store } from "./store";
import {v4 as uuid} from "uuid"
import { history } from "..";
import { Contestor } from "../App/Interfaces/Contestor";
import { AddContestor } from "../App/Interfaces/AddContestor";
export class TournamentStore
{
    tournamentLoading = false;
    tournamentMap = new Map<string, Tournament>();    
    selectedTournament: Tournament | undefined = undefined;
    addContestorModalOpen = false;
    creatingTournament = false;   
    editingTournament = false; 
    participateLoading = false;    

    constructor()
    {
        makeAutoObservable(this);
    }

    loadTournaments = async ()=>
    {
        this.tournamentLoading = true;
        try
        {
            const tournaments = await agent.Tournaments.get();
            
            tournaments.forEach(tournament=>
            {
                
                this.addToTournamentMap(tournament);
            });
            
        }
        catch(err)
        {
            console.log(err);
        }
        finally
        {
            runInAction(()=>
            {
                
                this.tournamentLoading = false;
            });
        }
    }

    addToTournamentMap = (tournament: Tournament) =>
    {
        tournament.date = new Date(tournament.date);
        this.tournamentMap.set(tournament.id, tournament);
    }
    
    get tournamentList()
    {
        return Array.from(this.tournamentMap.values());
    }

    selectTornament = async (id: string)=>
    {
        this.tournamentLoading = true;
        let tournament = this.tournamentMap.get(id);
        if(!tournament)
        {
            try
            {
                tournament = await agent.Tournaments.details(id);
                tournament.date = new Date(tournament.date);
            }
            catch(err)
            {
                console.log(err);
            }
            
        }
                  
        
        runInAction(()=>
        {
                this.selectedTournament = tournament; 

                this.tournamentLoading = false;
        });
        
    }

    createTournament = async (createdTournament: TournamentFormValues)=>
    {
        this.creatingTournament = true;
        const id = uuid();
        createdTournament.id = id;
        try
        {
            await agent.Tournaments.create(createdTournament);
            if(this.ifLoaded())
            {
               const tournament = new Tournament(createdTournament);
               this.addToTournamentMap(tournament);
        
            }
            history.push("/tournaments/"+createdTournament.id);
        }
        catch(err)
        {
            console.log(err);
        }
        finally
        {
            runInAction(()=>this.creatingTournament === false);
        }

    }

    editTournament = async (tournamentForm: TournamentFormValues)=>
    {
        this.editingTournament = true;
        const tournament = this.selectedTournament;
        try
        {
            await agent.Tournaments.edit(tournamentForm);
            if(tournament !== undefined)
            {
                runInAction(()=>
                {
                    tournament.name = tournamentForm.name;
                    tournament.sport = tournamentForm.sport;
                    tournament.numberOfRounds = tournamentForm.numberOfRounds;
                    tournament.location = tournamentForm.location;
                    tournament.date = tournamentForm.date;
                })
            }
            if(tournamentForm.id) history.push("/tournaments/"+tournamentForm.id);

        }
        catch(err)
        {
            console.log(err);
        }
        finally
        {
            runInAction(()=>this.editingTournament=false);
        }
    }

    deleteTournament = async (id: string)=>
    {
        this.tournamentLoading = true;
        try
        {   
            await agent.Tournaments.delete(id);
            this.tournamentMap.delete(id);
            history.push("/tournaments");
        }
        catch(err)
        {
            console.log(err);
        }
        finally
        {
            runInAction(()=>this.tournamentLoading=false);
        }
    }

    deselectTournament = ()=>
    {
        this.selectedTournament = undefined;
    }

    isAdmin = ()=>
    {
        if(!this.selectedTournament || !store.userStore.user) return false;

        const admins = this.selectedTournament.admins;
        const user = store.userStore.user;
        for(const admin of admins)
        {
            if(user.username === admin) return true;
        }
        return false;
    }

    ifLoaded = ()=>
    {
       
        return this.tournamentMap.size !== 0;
    }

    isContestor = ()=>
    {
        if(!this.selectedTournament) return false;
        if(!store.userStore.user) return false;

        const user =  this.selectedTournament.contestors.find(x=>x.username === store.userStore.user?.username);
        if(user) return true;

        return false;

    }

    isContestorByName = (displayName: string)=>
    {
        if(!this.selectedTournament) return false;
        const user = this.selectedTournament.contestors.find(x=>x.displayName.toLowerCase() === displayName.toLowerCase());

        if(user) return true;

        return false;
    }

    participate = async (id: string)=>
    {
        this.participateLoading = true;
        try
        {   
            await agent.Tournaments.participate(id);
            if(this.isContestor())
            {
                runInAction(()=>
                {
                    this.selectedTournament!.contestors = 
                    this.selectedTournament!.contestors.filter(x=>x.username !== store.userStore.user?.username);
                })
            }
            else if(this.selectedTournament && store.userStore.user)
            {
                runInAction(()=>
                {
                    const user = store.userStore.user;
                    const contestor = new Contestor(user!.username, user?.username)
                    
                    this.selectedTournament?.contestors.push(contestor);
                })
            }
        }
        catch(err)
        {
            console.log(err);
        }
        finally
        {
            runInAction(()=>this.participateLoading = false);
        }
    }

    setAddContestorModalOpen = (open: boolean)=>
    {
        this.addContestorModalOpen = open;
    }

    addContestor = async (values: AddContestor)=>
    {
        if(this.isContestorByName(values.name))
        {
            this.setAddContestorModalOpen(false);
            return store.errorStore.setError({head: "Već postoji natjecatelj sa tim imenom", statusCode: 400});
        }

        if(!this.selectedTournament) return;

        this.participateLoading = true;
        try
        {

            await agent.Tournaments.addContestor(this.selectedTournament.id, values.name, values.isGuest);
            if(this.selectedTournament)
            {
                const contestor = new Contestor(values.name, values.isGuest ? null: values.name);
                this.selectedTournament.contestors.push(contestor);
            }
        }
        catch(err)
        {
            console.log(err);
        }
        finally
        {
            runInAction(()=>
            {
                this.participateLoading = false;
                this.setAddContestorModalOpen(false);
            });
            
        }
    }

    removeContestor = async (values: AddContestor)=>
    {
        this.participateLoading = true;
        if(!this.isContestorByName(values.name))
        {
            this.setAddContestorModalOpen(false);
            return store.errorStore.setError({head: "Natjecatelj nije na popisu", statusCode: 400});
        }

        if(!this.selectedTournament) return;

        try
        {

            await agent.Tournaments.addContestor(this.selectedTournament.id, values.name, values.isGuest);
            if(this.selectedTournament)
            {
                this.selectedTournament.contestors = this.selectedTournament.contestors.filter(x=>x.displayName !== values.name);
            }
        }
        catch(err)
        {
            console.log(err);
        }
        finally
        {
            runInAction(()=>
            {
                this.participateLoading = false;
            });
            
        }

    }
}