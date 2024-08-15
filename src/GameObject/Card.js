export default class Card
{
    constructor(ori_position, ori_rotation, type)
    {
        this.ori_position = ori_position
        this.ori_rotation = ori_rotation
        this.type = type
        this.matched = false
    }
}