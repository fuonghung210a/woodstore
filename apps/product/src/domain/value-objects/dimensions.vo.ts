export class Dimensions {
  constructor(
    readonly lengthCm: number,
    readonly widthCm: number,
    readonly heightCm: number,
  ) {
    if (lengthCm < 0 || widthCm < 0 || heightCm < 0) {
      throw new Error('Dimensions must be non-negative');
    }
  }

  get volumeCm3(): number {
    return this.lengthCm * this.widthCm * this.heightCm;
  }

  equals(other: Dimensions): boolean {
    return (
      this.lengthCm === other.lengthCm &&
      this.widthCm === other.widthCm &&
      this.heightCm === other.heightCm
    );
  }
}
