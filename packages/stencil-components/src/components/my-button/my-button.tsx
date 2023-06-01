import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'my-button',
  styleUrl: 'my-button.css',
  scoped: true,
})
export class MyButton {
  // Button Type
  @Prop() type: 'button' | 'submit' = 'button';
  render() {
    return (
      <button type={this.type} class="button">
        <slot></slot>
      </button>
    );
  }
}
