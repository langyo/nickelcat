import React from 'react';
import Head from 'next/head';

import { connect } from 'react-redux';

import classnames from "classnames";
import { makeStyles } from "@material-ui/core/styles";

import { pages, models, views } from '../src/connector';

export default connect(state => state, dispatch => ({}))(props => {
  React.useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }, []);

  return ([
    <Head>
      <title>I 笔记</title>
      <link rel='icon' href='/favicon.ico' />
    </Head>,
    <>
      {Object.keys(views).map((n, index) => React.createElement(views[n], { key: n }))}
      {Object.keys(models).map((n, index) => React.createElement(models[n], { key: n }))}
      {React.createElement(pages[props.renderPage], { key: props.renderPage })}
    </>
  ]);
});
