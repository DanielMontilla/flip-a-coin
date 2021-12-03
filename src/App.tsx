import React from 'react';
import './App.css';
import { rand, randPick } from './util';

type face = 'heads' | 'tails'

interface props {};
interface state {
  face: face,
  animations: Record<`flip` | 'toss', React.CSSProperties | undefined>,
  flipping: boolean
}

export default class App extends React.Component<props, state> {

  public state: state = {
    face: randPick(['heads', 'tails']),
    animations: {
      flip: undefined,
      toss: undefined
    },
    flipping: false
  }

  public history: face[] = [];

  public render() {
    let { face } = this.state;
    let { toss, flip } = this.state.animations;

    return <div className="App">
      <div className="container">
        <div style={ toss } onAnimationEnd={ () => { this.resetAnims() } }>
          <div style={ flip }>
              <div className={`coin`} style={{ backgroundColor: `var(--${face})` }} onClick={ () => { this.flip() } }/>
          </div>
        </div>
      </div>
    </div>
  }

  /**
   * @description starts the flipping of the coin
   */
  private flip(): void {
    if (this.state.flipping) return;
    this.setState({ flipping: true });

    let change = (rand() > .5);

    let { toss, flip, details } = this.generateAnims(change);
    let { count, interval } = details;

    this.setState({ animations: { toss: toss, flip: flip } } );
    this.waitAndChange(interval, count, true);
  }

  /**
   * @description responsable for looking at current state and determining next color. Basically just changes the coin from red to blue
   */
  private toggleFace (): void {
    let { face: color } = this.state;
    if (!color || color === 'heads') {
      this.setState({face: 'tails'});
    } else {
      this.setState({face: 'heads'});
    }
  }

  /**
   * @description Handles the timings for color change of the coin
   * @param amount time required for next change
   * @param count remaining iterations of flip animation
   * @param first indicates if this is the first iteration (should only be true initially)
   */
  private waitAndChange(amount: number, count: number, first: boolean = false) {
    if (count === 0) { setTimeout( () => { this.setState({ flipping: false }) }, 100); return };
    count--;
    setTimeout( () => {
      this.toggleFace();
      this.waitAndChange(amount, count);
    }, (first) ? amount / 2 : amount )
  }

  /**
   * @description changes state so that related CSS animations styling is disabled on relevant objects
   */
  private resetAnims() {
    this.setState({ animations: { flip: undefined, toss: undefined } });
  }

  /**
   * 
   * @param change indicates whether the animation should end with the same color or change
   * @returns { Object } that describes CSS styling for applying animation
   */
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
