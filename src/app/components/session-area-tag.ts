import { Component, Input } from "@angular/core";

@Component({
  selector: "app-session-area-tag",
  template: `
    <ion-chip
      class="tag"
      [style]="'filter: hue-rotate(' + tagColourNumber + 'deg)'"
    >
      <ion-label>{{ tagText }}</ion-label>
    </ion-chip>
  `,
  styles: [
    `
      .tag {
        font-size: 12px;
        height: 26px;
        background: hsl(240 56% 90% / 1);
        color: hsl(240 30% 30% / 1);
        border-radius: 4px;
      }
    `,
  ],
})
export class SessionAreaTagComponent {
  tagText: string;
  tagColourNumber: number;
  @Input() set tag(tag: string) {
    if (tag) {
      this.tagColourNumber = this.getColourRotate(tag);
      this.setTag(tag);
    }
  }

  constructor() {}

  setTag(tag: string) {
    this.tagText =
      tag.charAt(0).toUpperCase() + tag.slice(1).split("_").join(" ");
  }

  getColourRotate(tag: string): number {
    const tags = [
      "citizenship",
      "creative_arts",
      "language",
      "mathematics_and_financial_literacy",
      "life_skills",
      "home_sciences",
      "environment",
    ];
    if (tags.includes(tag)) {
      return 45 * tags.indexOf(tag);
    } else {
      console.error("no colour defined for tag", tag);
      return tags.length;
    }
  }
}
