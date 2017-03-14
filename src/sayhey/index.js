import React, {Component} from 'react';
import {Header} from './header';
import {Title} from './title';
import {Footer} from './footer';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100%'
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  },
  p: {
    display: 'flex',
    alignItems: 'center'
  }
};

export class Index extends Component {
  constructor() {
    super();

    this.state = {
      activeDemo: false
    };
  }

  handleDemoClick() {
    this.setState({
      activeDemo: true
    });
  }

  render() {
    return (
      <div style={styles.container}>
        <Header/>
        <main style={styles.main}>
          <Title/>
        </main>
        <Footer/>
      </div>
    );
  }
}
