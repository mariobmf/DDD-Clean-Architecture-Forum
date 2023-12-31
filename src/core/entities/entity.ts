import { UniqueEntityId } from './unique-entity-id';

export abstract class Entity<T> {
  private _id: UniqueEntityId;
  protected props: T;

  protected constructor(props: T, id?: UniqueEntityId) {
    this.props = props;
    this._id = id ?? new UniqueEntityId();
  }

  get id() {
    return this._id;
  }

  public equals(entity: Entity<any>) {
    return entity === this || entity.id === this.id;
  }
}
