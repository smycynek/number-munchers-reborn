import { PositionService } from '../services/position.service';

describe('PositionService test', () => {
  let service: PositionService;
  beforeEach(() => {
    service = new PositionService();
  });
  it('should track positions and wrap around', () => {
    expect(service.getPosition()).toBe('0, 0');
    service.right();
    service.up();
    expect(service.getPosition()).toBe('1, 1');
    service.down();
    service.left();
    expect(service.getPosition()).toBe('0, 0');
    service.left();
    service.left();
    service.left();
    service.down();
    service.down();
    service.down();
    service.down();
    expect(service.getPosition()).toBe('0, 0');
  });
});
