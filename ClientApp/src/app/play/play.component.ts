import { Component, OnInit } from '@angular/core';
import { PlayService } from './play.service';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.css']
})
export class PlayComponent implements OnInit {

  message: string | undefined = undefined;

  constructor(private playService: PlayService) { }

  ngOnInit(): void {
    this.playService.getPlayers()
      .subscribe({
        next: (response: any) => {
          console.log(response)
          this.message = response.value.message as string
        },
        error: (error) => console.log(error)
      })
  }
}
