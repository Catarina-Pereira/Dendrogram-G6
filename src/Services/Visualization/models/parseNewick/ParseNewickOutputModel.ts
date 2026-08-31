export interface ParseNewickOutputModel {
    name: string
    edgeLength?: number
    children?: ParseNewickOutputModel[]
    id: string
    collapsed?: boolean
    positionX?: number
    positionY?: number         
}