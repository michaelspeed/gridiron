export abstract class GridIronEvents {
    public readonly createdAt: Date
    protected constructor() {
        this.createdAt = new Date()
    }
}
