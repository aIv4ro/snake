import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { Subscription } from 'rxjs'
import { interval } from 'rxjs/internal/observable/interval'
import { Snake } from 'src/app/classes/snake'
import { Vector2 } from 'src/app/classes/vector-2'
import { halfSize, itemSize } from 'src/app/utils/constants'

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>
  score = 1
  snake = new Snake(new Vector2(itemSize))

  private context!: CanvasRenderingContext2D
  private subscriptions: Subscription[] = []
  private update = interval(100)

  ngOnInit (): void {
    this.context = this.canvas.nativeElement.getContext('2d')!
    this.subscriptions.push(
      this.update.subscribe({
        next: () => this.onUpdate()
      })
    )
  }

  ngOnDestroy (): void {
    this.subscriptions.forEach(s => s.unsubscribe())
  }

  onUpdate () {
    const { width, height } = this.canvas.nativeElement
    this.context.clearRect(0, 0, width, height)
    const resetGame = this.snake.gameOver()
    if (resetGame) location.reload()
    this.snake.update()
    this.snake.items.forEach(({ position }) => {
      this.context.fillStyle = 'black'
      this.context.fillRect(position.x, position.y, itemSize, itemSize)
    })
    this.snake.apples.forEach(({ x, y }) => {
      this.context.fillStyle = '#d90429'
      this.context.beginPath()
      this.context.arc(x + halfSize, y + halfSize, halfSize, 0, 2 * Math.PI, false)
      this.context.fill()
    })
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown (event: KeyboardEvent) {
    const { key } = event
    if (!key) return
    const obj = {
      up: key === 'ArrowUp',
      left: key === 'ArrowLeft',
      down: key === 'ArrowDown',
      right: key === 'ArrowRight'
    }
    this.snake.move(obj)
  }
}
