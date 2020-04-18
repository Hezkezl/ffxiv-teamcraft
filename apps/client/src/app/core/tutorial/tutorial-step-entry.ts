import { Observable } from 'rxjs';

export class TutorialStepEntry {
  constructor(public readonly key: string,
              public readonly play: (index: number, total: number) => Observable<void>) {
  }
}
