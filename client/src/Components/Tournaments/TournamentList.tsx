import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react"
import { Divider, Header } from "semantic-ui-react"
import { User } from "../../App/Interfaces/User";
import { store } from "../../Stores/store";


export default observer( ()=>
{
    const {tournamentStore} = store;
    const {loadTournaments, tournamentList, tournamentMap} = tournamentStore;
    const [user, setUser] = useState<User | null>(null);

    store.userStore.getUser().then(value=>{setUser(value)});

    useEffect(()=>
    {
        if(!tournamentMap.keys.length)
        {

            loadTournaments();
        }
        
    },[loadTournaments])

    return(
        <>
            <Header as="h1">Tournaments</Header>
            {tournamentList.map(tournament=>(
                <div key={tournament.id}>{tournament.sport}</div>
            ))}
            {user && <div>{user.username}</div>}
        </>
    )
});