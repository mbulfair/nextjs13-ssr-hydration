import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'my-text-component',
  styleUrl: 'my-text-component.css',
  scoped: true,
})
export class MyTextComponent {
  /** tag: Renders a html tag */
  @Prop() tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'p' | 'span' = 'p';
  render() {
    const CustomTag = this.tag;
    return (
      <Host class={{ ['text-block']: this.tag !== 'span' }}>
        <CustomTag
          class={{
            text: true,
          }}
        >
          <slot></slot>
        </CustomTag>
      </Host>
    );
  }
}
