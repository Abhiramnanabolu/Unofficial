function hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0; // Convert to 32-bit integer
    }
    return hash;
  }
  
  function usernameToColorVariations(username: string, count: number = 20): [string, string][] {
    const hash = hashCode(username);
    const variations: [string, string][] = [];
  
    for (let i = 0; i < count; i++) {
      const hue1 = ((hash * (i + 1)) % 360 + 360) % 360;
      const hue2 = ((hash * (i + 3)) % 360 + 360) % 360;
      variations.push([`hsl(${hue1}, 70%, 60%)`, `hsl(${hue2}, 70%, 60%)`]);
    }
  
    return variations;
  }
  
  export default function GradientAvatar({ username, size = 100, className }: {
    username: string;
    size?: number;
    className?: string;
  }) {
    const colorVariations = usernameToColorVariations(username);
  
    return (
      <div className="grid grid-cols-5 gap-4 p-6">
        {colorVariations.map((colors, index) => (
          <div key={index} className="flex flex-col items-center">
            <div
              className={`rounded-full shadow-md ${className}`}
              style={{
                width: size,
                height: size,
                background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`,
              }}
            />
            <p className="mt-2 text-sm">Variation {index + 1}</p>
          </div>
        ))}
      </div>
    );
  }