import React from "react";
import {HashRouter as Router, Route, Switch} from "react-router-dom";

import ViewCardPage from "./components/card/ViewCardPage";
import AddCardPage from "./components/card/AddCardPage";
import EditCardView from "./components/edit/edit-card-view";
import MenuView from "./components/menu/menu-view";
import GroupView from "./components/group/group-view";
import BudgetView from "./components/group/budget-view";
import GroupHomePage from "./components/group/home-page";
import LoginPage from "./components/Login/LoginPage";
import LandingPage from "./components/Landing/LandingPage";
import AdminPage from "./components/Pencil/Admin/AdminPage";
import PlanPage from "./components/PlanEvent/PlanPage";
import EventHomePage from "./components/PlanEvent/EventHomePage";
import AccreditPage from "./components/Accredit/AccreditPage";
import CounterPage from "./components/Counter/CounterPage";
import ForgePage from "./components/Forge/ForgePage";
import CreatePollPage from "./components/GoGo/CreatePollPage";
import CreatePollSuccessPage from "./components/GoGo/CreatePollSuccessPage";
import ViewPollPage from "./components/GoGo/View/ViewPollPage";
import EditEventPage from "./components/GoGo/EditEventPage";
import ZoomAppView from "./components/Zoom/ZoomAppView";
import CodeVisualPage from "./components/Forge/CodeVisualPage";

export default
<Router>
    <div>
        <Switch>
            <Route exact path="/" component={LandingPage}/>
            <Route path="/card/add" component={AddCardPage}/>
            <Route path="/card/:rootId/:nodeId" component={ViewCardPage}/>
            <Route path="/card/:rootId" component={ViewCardPage}/>
            <Route path="/edit/:nodeId" component={EditCardView}/>

            <Route path="/shop/menu" component={MenuView}/>

            <Route path="/shop/menu" component={MenuView}/>

            <Route path="/group/home" component={GroupHomePage}/>
            <Route path="/group/main" component={GroupView}/>
            <Route path="/group/budget" component={BudgetView}/>
            <Route path="/login" component={LoginPage}/>
            <Route path="/pencil/admin" component={AdminPage}/>
            <Route path="/accredit" component={AccreditPage}/>
            <Route path="/app/event/payment" component={PlanPage}/>
            <Route path="/app/event/home" component={EventHomePage}/>
            <Route path="/app/counter" component={CounterPage}/>
            <Route path="/app/forge" component={ForgePage}/>

            /**
            Visualize code. A cheatsheet article. When hover the pointer over a piece of code
            an explanation is displayed.

            Access URL: http://localhost:8080/app#/app/code */
            <Route path="/app/code" component={CodeVisualPage}/>

            <Route path="/gogo/createPoll" component={CreatePollPage}/>
            <Route path="/gogo/createPollSuccess" component={CreatePollSuccessPage}/>
            <Route path="/gogo/view/:eventId" component={ViewPollPage}/>
            <Route path="/gogo/edit/:eventId" component={EditEventPage}/>

            <Route path="/zoom" component={ZoomAppView}/>
        </Switch>
    </div>
</Router>;
