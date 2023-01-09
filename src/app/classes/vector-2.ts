import { itemSize } from '../utils/constants'

export class Vector2 {
  x: number
  y: number

  constructor (x: number = 0, y: number = 0) {
    this.x = x
    this.y = y
  }

  isUp (): boolean {
    return this.x === 0 && this.y === -itemSize
  }

  isLeft (): boolean {
    return this.x === -itemSize && this.y === 0
  }

  isDown (): boolean {
    return this.x === 0 && this.y === itemSize
  }

  isRight (): boolean {
    return this.x === itemSize && this.y === 0
  }
}
