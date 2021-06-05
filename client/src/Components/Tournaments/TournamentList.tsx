import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react"
import { Grid, Header, Item, Segment } from "semantic-ui-react"
import { store } from "../../Stores/store";
import LoadingComponent from "../Loading/LoadingComponent";
import TournamentCard from "./TournamentCard";
import InfiniteScroll from 'react-infinite-scroller';

export default observer(() => {

    const { tournamentStore } = store;
    const { loadTournaments, paginatedList,
         tournamentLoading, 
        totalPages,currentPage } = tournamentStore;
    const [loadingNext, setLoadingNext] = useState(false);
    
    useEffect(()=>
    {
        let mounted = true;
        if(paginatedList.length ===0 && mounted)
        {
            loadTournaments();

        }
        
        return ()=>{mounted = false};
    }, [loadTournaments, setLoadingNext, paginatedList.length])

    const handleLoadMore = async () => {
        if(!loadingNext)
        {
            setLoadingNext(true);
            
            await loadTournaments();
            setLoadingNext(false);
        }
    }

    if(tournamentLoading && !loadingNext) 
    return (
        <Segment style={{height: 500}}>
            <LoadingComponent text="Učitavanje"/>
        </Segment>
    
    )

    return (
        <>
            <Grid>
                <Grid.Column width="12">
                    <Header as="h1" style={{ padding: 20 }} textAlign="center">Turniri</Header>
                    
                    <div>
                    <InfiniteScroll

                        pageStart={1}
                        loadMore={handleLoadMore}
                        hasMore={(currentPage<= totalPages) && !tournamentLoading}
                        
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
                        <Segment style={{height: 300}}>
                            <LoadingComponent text="Učitavanje"/>
                        </Segment>
                    }
                    </div>
                </Grid.Column>

                <Grid.Column>
                    <Header textAlign="center" as="h2">Filteri</Header>
                </Grid.Column>

            </Grid>





        </>
    )
});