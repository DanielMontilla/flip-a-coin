import React from 'react';
import './App.css';
import { rand, randPick } from './util';

type color = 'red' | 'blue'

interface props {};
interface state {
  color: color,
  animations: Record<`flip` | 'toss', React.CSSProperties | undefined>,
  flipping: boolean
}

export default class App extends React.Component<props, state> {

  public state: state = {
    color: randPick(['red', 'blue']),
    animations: {
      flip: undefined,
      toss: undefined
    },
    flipping: false
  }

  public history: color[] = [];

  public render() {
    let { color } = this.state;
    let { toss, flip } = this.state.animations;

    return <div className="App">
      <div className="container" onClick={ () => { this.flip() }}>
        <div style={ toss } onAnimationEnd={ () => { this.resetAnims() } }>
          <div style={ flip }>
              <div className={`coin`} style={{ backgroundColor: color }}/>
          </div>
        </div>
      </div>
    </div>
  }

  private flip() {
    if (this.state.flipping) return;
    this.setState({ flipping: true });

    let change = (rand() > .5);

    let { toss, flip, details } = this.generateAnims(change);
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

  private waitAndChange(amount: number, count: number, first: boolean = false) {
    if (count === 0) { setTimeout( () => { this.setState({ flipping: false }) }, 100); return };
    count--;
    setTimeout( () => {
      this.toggleColor();
      this.waitAndChange(amount, count);
    }, (first) ? amount / 2 : amount )
  }

  private resetAnims() {
    this.setState({ animations: { flip: undefined, toss: undefined } });
  }

  private generateAnims(change: boolean): { 
    flip: React.CSSProperties,
    toss: React.CSSProperties, 
    details: {
      interval: number,
      count: number
    } 
  } {
    let odds = [ 3, 5, 7 ];
    let evens = [ 4, 6 ];

    // change == true => flips = odd
    // change == false => flips = even

    let posabilities = (change) ? odds : evens;

    let tosses = 1;
    let flips = randPick(posabilities);
    let tossDuration = flips * 325;
    let flipDuration = Math.round(tossDuration / flips);
 
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
          animationTimingFunction: 'ease-in'
       },

       details: {
         count: flips,
         interval: flipDuration
       }
    }
  }
}
