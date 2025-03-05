
function hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0; // Convert to 32-bit integer
    }
    return hash;
  }

function usernameToColors(username: string): [string, string] {
    const hash = hashCode(username);
    const color1 = `hsl(${(hash % 360 + 360) % 360}, 70%, 60%)`;
    const color2 = `hsl(${((hash * 3) % 360 + 360) % 360}, 70%, 60%)`;
    return [color1, color2];
}

export default function GradientAvatar({ username, size = 100 }: { username: string; size?: number }) {
    const [color1, color2] = usernameToColors(username);
  
    return (
      <div
        className="rounded-full"
        style={{
          width: size,
          height: size,
          background: `linear-gradient(135deg, ${color1}, ${color2})`,
        }}
      />
    );
  }
  