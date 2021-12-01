import React from 'react';
import { setInterval } from 'timers';
import './App.css';

// import { randInt } from './util';

interface props {};
interface state {
  state: boolean,
  color: string | undefined
  animations: Record<`flip` | 'toss', React.CSSProperties | undefined>
}

export default class App extends React.Component<props, state> {

  public state: state = {
    state: true,
    color: undefined,
    animations: {
      flip: undefined,
      toss: undefined
    }
  }

  public history: string[] = [];

  public render() {
    let { color } = this.state;
    let { toss, flip } = this.state.animations;

    return <div className="App">
      <div className="container">
        <div style={ toss } onAnimationEnd={ () => { this.resetAnims() } }>
          <div style={ flip }>
              <div className={`coin`} style={{ backgroundColor: color }}/>
          </div>
        </div>
        <button onClick={ () => { this.flip() }} disabled={(toss !== undefined)}> hi </button>
      </div>
    </div>
  }

  private flip() {
    // let result = (rand() > .5);
    let { toss, flip, details } = this.generateAnims();
    let { count, interval } = details;
    this.setState({ animations: { toss: toss, flip: flip } } );
    this.waitAndChange(interval, count, true);
    
  }

  private toggleColor () {
    let { color } = this.state;
    if (!color || color === 'red') {
      this.setState({color: 'blue'});
    } else {
      this.setState({color: 'red'});
    }
  }

  private waitAndChange(amount: number, count: number, f: boolean = false) {
    if (count === 0) return;
    count--;
    setTimeout( () => {
      this.toggleColor();
      this.waitAndChange(amount, count);
    }, (f) ? amount / 2 : amount )
  }

  private resetAnims() {
    this.setState({ animations: { flip: undefined, toss: undefined } });
  }

  private generateAnims(): { 
    flip: React.CSSProperties,
    toss: React.CSSProperties, 
    details: {
      interval: number,
      count: number
    } 
  } {

    let tosses = 1;
    let flips = 4;
    let tossDuration = 1500;
    let flipDuration = Math.round(tossDuration / flips) - .01*tossDuration;

 
    return {
       flip: {
          animationName: 'flip',
          animationDuration: `${flipDuration}ms`,
          animationIterationCount: flips,
          animationTimingFunction: 'linear'
       },
       toss: {
          animationName: 'toss',
          animationDuration: `${tossDuration}ms`,
          animationIterationCount: tosses,
          animationTimingFunction: 'ease-in-out'
       },

       details: {
         count: flips,
         interval: flipDuration
       }
    }
  }
}
