import React, {Component} from 'react';

const styles = {
  footer: {
    padding: '0.5rem',
    fontSize: '1rem',
    backgroundColor: '#1f1f1f',
    textAlign: 'center',
    color: 'white'
  }
};

export class Footer extends Component {
  render() {
    return (
      <footer style={styles.footer}>
        Сделано с ♥ &nbsp;
        <a href="https://github.com/ofkindness">
          ofkindness
        </a>
      </footer>
    );
  }
}
