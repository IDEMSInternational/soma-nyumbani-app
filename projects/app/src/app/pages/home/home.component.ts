import { Component, OnInit } from '@angular/core';
import { DbService } from '@soma-nyumbani/shared';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(private db: DbService) {
    console.log('hello db service');
  }

  ngOnInit(): void {}
}
