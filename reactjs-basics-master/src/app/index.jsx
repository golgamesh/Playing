import React from "react";
import { render } from "react-dom";
import { Header } from "./components/header";
import { Home } from "./components/home";
import { App } from "./components/app";
import { Provider } from "react-redux";



import { createStore, combineReducers, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';

const initalState = {
    result: 1,
    lastValues:[]
};

const math = (state = {
    result: 1,
    lastValues:[]
}, action) => {
    switch(action.type) {
        case 'ADD':
            state = {
                ...state,
                result: state.result + action.payload,
                lastValues: [...state.lastValues, action.payload]
            };
            break;
        case 'SUBSTRACT':
            state = {
                ...state,
                result: state.result - action.payload,
                lastValues: [...state.lastValues, action.payload]
            };
            break;
    }
    return state;
};

const user = (state = {
        name: "Max",
        age: 27
    }, action) => {
    switch(action.type) {
        case 'SET_AGE':
            state = {
                ...state,
                age: action.payload
            };
            break;
/*         case 'SUBTRACT':
            state = {
                ...state,
                result: state.result - action.payload,
                lastValues: [...state.lastValues, action.payload]
            };
            break; */
    }
    return state;
};

const myLogger = (store) => (next) => (action) => {
    //console.log("Logged Action: ", action);
    next(action);
};

const store = createStore(combineReducers({ math, user }), {}, applyMiddleware(myLogger, createLogger()));

store.subscribe(() => {
    console.log("Store updated", store.getState());
});

 store.dispatch({
     type: "ADD",
     payload: 10 
 });

 store.dispatch({
     type:"ADD",
     payload: 100
 });

 store.dispatch({
    type:"SUBTRACT",
    payload:22
 });

 store.dispatch({
    type:"SET_AGE",
    payload:22
 });

 
render(
    <Provider store={store}>
        <App/>
    </Provider>
    , window.document.getElementById('app'));