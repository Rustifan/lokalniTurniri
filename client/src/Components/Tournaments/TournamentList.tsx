import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react"
import { Grid, Header, Item } from "semantic-ui-react"
import { store } from "../../Stores/store";
import LoadingComponent from "../Loading/LoadingComponent";
import TournamentCard from "./TournamentCard";
import InfiniteScroll from 'react-infinite-scroller';
import FiltersComponent from "./FiltersComponent";
import TournamentMapList from "./TournamentMapList";

export default observer(() => {

    const { tournamentStore } = store;
    const { loadTournaments, paginatedList,
         tournamentLoading, loaded,
        tournamentLoadingParams } = tournamentStore;
    const [loadingNext, setLoadingNext] = useState(false);
    const {toggleFilter} = tournamentLoadingParams;
    
    useEffect(()=>
    {
        let mounted = true;
        if(paginatedList.length ===0 && mounted && !tournamentLoading && !loaded)
        {
            loadTournaments();

        }
        
        return ()=>{mounted = false};
    }, [loadTournaments, setLoadingNext, paginatedList.length, tournamentLoading, loaded])

    const handleLoadMore = async () => {
        if(!loadingNext && paginatedList.length >= tournamentLoadingParams.itemPerPage)
        {
            setLoadingNext(true);
            
            await loadTournaments();
            setLoadingNext(false);
        }
    }


    return (
        <>
            <Grid>
                <Grid.Column width="12">
                    <Header as="h1" style={{ padding: 20 }} textAlign="center">Turniri</Header>
                    
                {tournamentLoading && !loadingNext ? 
                    <LoadingComponent text="Učitavanje turnira"/> :
                    
                    toggleFilter==="list" ? 
                    <div>
                    <InfiniteScroll
                        pageStart={1}
                        loadMore={handleLoadMore}
                        hasMore={(tournamentLoadingParams.currentPage<= tournamentLoadingParams.totalPages) 
                            && !tournamentLoading}
                        useWindow={true}
                        initialLoad={false}
                        >
                        
                        

                        <Item.Group divided>
                            {paginatedList.map(tournament => (
                                <TournamentCard key={tournament.id} tournament={tournament} />
                            ))}

                        </Item.Group>
                    </InfiniteScroll>
                    {loadingNext && 
                        <LoadingComponent text="Učitavanje"/>
                    }
                    </div>
                    :
                    <TournamentMapList/>
                    
                }
                </Grid.Column>

                <Grid.Column width="4">
                    <FiltersComponent/>
                </Grid.Column>

            </Grid>





        </>
    )
});