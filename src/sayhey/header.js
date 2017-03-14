import React, {Component} from 'react';

const styles = {
  header: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#1f1f1f'
  }
};

export class Header extends Component {
  render() {
    return (
      <header style={styles.header}>
        <p/>
      </header>
    );
  }
}
