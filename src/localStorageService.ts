import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private winStreakKey= 'nm:winStreak';
  private highScoreKey = 'nm:highScore';

  setWinStreak(winStreak: number) {
    localStorage.setItem(this.winStreakKey, JSON.stringify(winStreak));
  }

  setHighScore(highScore: number) {
    localStorage.setItem(this.highScoreKey, JSON.stringify(highScore));
  }

  getWinStreak(): number {
    const winStreak = localStorage.getItem(this.winStreakKey);
    return winStreak ? Number(JSON.parse(winStreak)) : 0;
  }

  getHighScore(): number {
    const highScore = localStorage.getItem(this.highScoreKey);
    return highScore ? Number(JSON.parse(highScore)) : 0;
  }
}
