import React, { useState, createContext, useLayoutEffect, useEffect } from "react";
import { Routes, Route, Link} from 'react-router-dom';
import Login from "../pages/Login";
import Register from "../pages/Register";
import Groups from "../pages/Groups";
import ProtectedRoutes from "../components/ProtectedRoutes";
import Group from "../pages/Group";
import Post from "../pages/Post";
import AlertComponent from "../components/AlertComponent";
import NoticeComponent from "../components/NoticeComponent";
import { get } from "./apiCallsHelper";
import NotFound from "../pages/NotFound";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell } from '@fortawesome/free-solid-svg-icons'
import LoadingComponent from "../components/LoadingComponent";
import actionCable from 'actioncable'

export {
  React, useState, createContext, useLayoutEffect, useEffect,
  Routes, Route, Link,
  Login,
  Register,
  Groups,
  ProtectedRoutes,
  Group,
  Post,
  AlertComponent,
  NoticeComponent,
  get,
  NotFound,
  FontAwesomeIcon,
  faBell,
  LoadingComponent,
  actionCable,
}
