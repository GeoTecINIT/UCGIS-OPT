import { TestBed } from '@angular/core/testing';

import { FirestoreExtensionService } from './firestore-extension.service';

describe('FirestoreExtensionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FirestoreExtensionService = TestBed.get(FirestoreExtensionService);
    expect(service).toBeTruthy();
  });
});
