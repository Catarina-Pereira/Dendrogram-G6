import * as React from 'react'
import './App.css'
import {Route, Routes} from 'react-router-dom'
import About from "./Pages/About/About"
import {WebUiUris} from "./Pages/WebUiUris"
import Dashboard from "./Layouts/Dashboard/Dashboard"
import {Home} from "./Pages/Home/Home"
import News from "./Pages/News/News"
import APIInfo from "./Pages/APIInfo/APIInfo"
import CreateDataset from "./Pages/Project/CreateDataset/CreateDataset"
import NewProject from "./Pages/NewProject/NewProject"
import OpenProject from "./Pages/OpenProject/OpenProject"
import Project from "./Pages/Project/Project"
import {NotFoundPage} from "./Pages/NotFoundPage"
import UploadFiles from "./Pages/Project/UploadFiles/UploadFiles"
import IsolateData from "./Pages/Project/IsolateData/IsolateData"
import TypingData from "./Pages/Project/TypingData/TypingData"
import DatasetDetails from "./Pages/Project/DatasetDetails/DatasetDetails"
import EditProject from "./Pages/Project/EditProject/EditProject";
import EditDataset from "./Pages/Project/EditDataset/EditDataset";
import TreeViewDendogramPage from './Pages/Project/TreeView/Layouts/Dendogram/TreeViewDendogramPage'
import HOME = WebUiUris.HOME;
import ABOUT = WebUiUris.ABOUT;
import NEWS = WebUiUris.NEWS;
import API_INFO = WebUiUris.API_INFO;
import CREATE_DATASET = WebUiUris.CREATE_DATASET;
import OPEN_PROJECT = WebUiUris.OPEN_PROJECT;
import PROJECT = WebUiUris.PROJECT;
import TYPING_DATA = WebUiUris.TYPING_DATA;
import ISOLATE_DATA = WebUiUris.ISOLATE_DATA;
import UPLOAD_FILES = WebUiUris.UPLOAD_FILES;
import NEW_PROJECT = WebUiUris.NEW_PROJECT;
import DATASET = WebUiUris.DATASET;
import EDIT_PROJECT = WebUiUris.EDIT_PROJECT;
import EDIT_DATASET = WebUiUris.EDIT_DATASET;
import COMPUTE_DENDOGRAM = WebUiUris.COMPUTE_DENDOGRAM;

/**
 * App component.
 */
export default function App() {

    return (
        <div className="App">
            <div className="App-content">
                <Dashboard>
                    <Routes>
                        <Route path={HOME} element={<Home/>}/>
                        <Route path={ABOUT} element={<About/>}/>
                        <Route path={NEWS} element={<News/>}/>
                        <Route path={API_INFO} element={<APIInfo/>}/>
                        <Route path={NEW_PROJECT} element={<NewProject/>}/>
                        <Route path={OPEN_PROJECT} element={<OpenProject/>}/>
                        <Route path={PROJECT} element={<Project/>}>
                            <Route path={CREATE_DATASET} element={<CreateDataset/>}/>
                            <Route path={UPLOAD_FILES} element={<UploadFiles/>}/>
                            <Route path={EDIT_PROJECT} element={<EditProject/>}/>
                            <Route
                                path={TYPING_DATA}
                                element={<TypingData/>}
                            />
                            <Route
                                path={ISOLATE_DATA}
                                element={<IsolateData/>}
                            />
                            <Route
                                path={DATASET}
                                element={<DatasetDetails/>}
                            />
                            <Route
                                path={EDIT_DATASET}
                                element={<EditDataset/>}
                            />
                            <Route
                                path={COMPUTE_DENDOGRAM}
                                element={<TreeViewDendogramPage/>}
                            />
                        </Route>

                        <Route path="*" element={<NotFoundPage/>}/>
                    </Routes>
                </Dashboard>
            </div>
        </div>
    )
}
