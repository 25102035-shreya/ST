export function triggerHaptic(type: 'light' | 'medium' | 'heavy' | 'success' | 'warning' = 'light', enabled = true) {
  if (!enabled || typeof window === 'undefined') return;
  
  if ('vibrate' in navigator) {
    try {
      switch (type) {
        case 'light':
          navigator.vibrate(12);
          break;
        case 'medium':
          navigator.vibrate(25);
          break;
        case 'heavy':
          navigator.vibrate([40]);
          break;
        case 'success':
          navigator.vibrate([15, 30, 20]);
          break;
        case 'warning':
          navigator.vibrate([30, 40, 30]);
          break;
      }
    } catch {
      // Ignore vibration errors if blocked by browser policy
    }
  }
}
