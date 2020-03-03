import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

// CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import 'rodal/lib/rodal.css';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import 'antd/dist/antd.css';
import 'semantic-ui-css/semantic.min.css';
import 'react-virtualized/styles.css';
import 'react-infinite-calendar/styles.css';
import 'toastr/build/toastr.css';

// jquery
import $ from 'jquery';
import Popper from 'popper.js';
import 'bootstrap/dist/js/bootstrap.bundle.min';

ReactDOM.render(<App />, document.getElementById('root'));