import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';

export function useWebGLGuard() {
  const gl = useThree((s) => s.gl);
  const invalidate = useThree((s) => s.invalidate);

  useEffect(() => {
    const canvas = gl.domElement;

    const handleContextLost = (e: Event) => {
      e.preventDefault();
    };

    const handleContextRestored = () => {
      invalidate();
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        invalidate();
      }
    };

    canvas.addEventListener('webglcontextlost', handleContextLost);
    canvas.addEventListener('webglcontextrestored', handleContextRestored);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      canvas.removeEventListener('webglcontextrestored', handleContextRestored);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [gl, invalidate]);
}
