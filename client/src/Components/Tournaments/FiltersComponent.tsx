import React, { useState } from "react"
import {  Container, Header, Menu } from "semantic-ui-react"
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { TournamentContestingFilterEnum, TournamentFlowFilterEnum } from "../../App/Interfaces/Tournament";
import { store } from "../../Stores/store";
import { observer } from "mobx-react-lite";

export default observer(function FiltersComponent() {

    const {tournamentStore, userStore: {isLogedIn}} = store;
    const {setSearchDate, 
            setSearchContestingFilter,
            setSearchFlowFilter,
            loadTournaments ,
            tournamentLoadingParams: {contestingFilter, date, flowFilter}} = tournamentStore;
    const [activeContestingItem, setActiveContestingItem] = useState<TournamentContestingFilterEnum>(contestingFilter);
    const [activeFlowItem, setActivetFlowItem] = useState<TournamentFlowFilterEnum>(flowFilter);
    const [selectedDate, setSelectedDate] = useState(date);

    const handleChangeDate = (date: Date)=>
    {
       
        setSelectedDate(date);
        setSearchDate(date);
        loadTournaments();
    }

    const hadleClickMenuContestingItem = (name: TournamentContestingFilterEnum)=>
    {
        setActiveContestingItem(name);
        setSearchContestingFilter(name);
        loadTournaments();

    }

    const handleClickMenuFlowItem = (name: TournamentFlowFilterEnum)=>
    {
        setActivetFlowItem(name);
        setSearchFlowFilter(name);
        loadTournaments();
    }

    return (
        <Container style={{ marginTop: 90 }}>
            <Header as="h3" textAlign="center">Filteri:</Header>

            {isLogedIn() &&
            <Menu  style={{marginTop: 15}} vertical fluid>
                
                <Menu.Item header style={{backgroundColor: "#2185d0", color: "white"}}>
                    Prema sudjelovanju:
                </Menu.Item>

                <Menu.Item 
                    color="blue" onClick={()=>hadleClickMenuContestingItem("all")} 
                    active={activeContestingItem==="all"} 
                    name="all">
                    Svi turniri
                </Menu.Item>

                <Menu.Item 
                    color="blue" onClick={()=>hadleClickMenuContestingItem("contestor")} 
                    active={activeContestingItem==="contestor"} 
                    name="contestor">
                    Kao natjecatelj
                </Menu.Item>

                <Menu.Item 
                    color="blue" onClick={()=>hadleClickMenuContestingItem("administrator")} 
                    active={activeContestingItem==="administrator"} 
                    name="administrator">
                    Kao administrator
                </Menu.Item>
            </Menu>
            }

            <Menu  style={{marginTop: 30}} vertical fluid>
                
                <Menu.Item header style={{backgroundColor: "#2185d0", color: "white"}}>
                    Prema fazi turira:
                </Menu.Item>

                <Menu.Item 
                    color="blue" onClick={()=>handleClickMenuFlowItem("all")} 
                    active={activeFlowItem==="all"} 
                    name="all">
                    Svi turniri
                </Menu.Item>

                <Menu.Item 
                    color="blue" onClick={()=>handleClickMenuFlowItem("openApplications")} 
                    active={activeFlowItem==="openApplications"} 
                    name="openApplications">
                    Otvorene prijave
                </Menu.Item>

                <Menu.Item 
                    color="blue" 
                    onClick={()=>handleClickMenuFlowItem("inProcess")} 
                    active={activeFlowItem==="inProcess"}
                    name="inProcess">
                    U tijeku
                </Menu.Item>

                <Menu.Item 
                    color="blue" 
                    onClick={()=>handleClickMenuFlowItem("ended")} 
                    active={activeFlowItem==="ended"}
                    name="ended">
                    Završeni
                </Menu.Item>
            </Menu>


           

            <div style={{marginTop: 30}}>
            <Calendar
                locale="hr"
                onChange={handleChangeDate}
                value={selectedDate}
            />
    </div>

        </Container>
    )
});