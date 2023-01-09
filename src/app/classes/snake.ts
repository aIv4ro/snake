import { Direction } from '../interfaces/direction'
import { canvasLimit, itemSize } from '../utils/constants'
import { getRandom } from '../utils/getRandom'
import { SnakeItem } from './snake-item'
import { Vector2 } from './vector-2'

export class Snake {
  velocity: Vector2
  items: SnakeItem[] = [
    new SnakeItem(new Vector2(20)),
    new SnakeItem(new Vector2(0, 0))
  ]

  apples: Vector2[] = [new Vector2(40, 60)]

  constructor (velocity: Vector2) {
    this.velocity = velocity
  }

  update () {
    [...this.items].reverse().forEach((item, index) => {
      if (this.velocity.x === 0 && this.velocity.y === 0) return
      const { x, y } = item.position
      if (index !== this.items.length - 1) {
        const { position } = this.items[this.items.length - index - 2]
        item.position = new Vector2(position.x, position.y)
      } else {
        item.position = new Vector2(x + this.velocity.x, y + this.velocity.y)
      }
    })
    const { position } = this.items.at(0)!
    const apple = this.apples.find(apple => apple.x === position.x && apple.y === position.y)
    if (apple !== undefined) this.eatApple(apple)
  }

  move (obj: Direction) {
    const { position } = this.items.at(0)!
    const { position: position2 } = this.items.at(1)!
    const hasMove = position.x - this.velocity.x === position2.x && position.y - this.velocity.y === position2.y
    if (!hasMove) return
    if (obj.up && !this.velocity.isDown()) this.velocity = new Vector2(0, -itemSize)
    if (obj.left && !this.velocity.isRight()) this.velocity = new Vector2(-itemSize, 0)
    if (obj.down && !this.velocity.isUp()) this.velocity = new Vector2(0, itemSize)
    if (obj.right && !this.velocity.isLeft()) this.velocity = new Vector2(itemSize, 0)
  }

  eatApple (apple: Vector2) {
    const indexForDelte = this.apples.indexOf(apple)
    this.apples.splice(indexForDelte, 1)
    const { x, y } = this.items.at(-1)?.position!
    this.items.push(new SnakeItem(new Vector2(x, y)))
    this.generateApple()
  }

  generateApple () {
    const x = getRandom(canvasLimit)
    const y = getRandom(canvasLimit)
    this.apples.push(new Vector2(x, y))
  }

  gameOver (): boolean {
    const { position } = this.items.at(0)!
    const collision = this.items.slice(1).find(({ position: other }) => {
      return other.x === position.x && other.y === position.y
    }) !== undefined
    return collision || position.x < 0 || position.x > 380 || position.y < 0 || position.y > 380
  }
}
