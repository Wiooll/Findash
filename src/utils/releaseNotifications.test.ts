import { describe, expect, it } from 'vitest';
import { hasUnseenRelease } from './releaseNotifications';

describe('releaseNotifications', () => {
  it('indica release nao visualizada quando versao e diferente', () => {
    expect(hasUnseenRelease('4.5.0', '4.4.1')).toBe(true);
  });

  it('nao indica release nao visualizada quando versao e igual', () => {
    expect(hasUnseenRelease('4.5.0', '4.5.0')).toBe(false);
  });

  it('indica release nao visualizada quando nao ha registro anterior', () => {
    expect(hasUnseenRelease('4.5.0', null)).toBe(true);
  });
});
