export const AICircuitBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Circuit Board SVG */}
      <svg
        className="absolute inset-0 w-full h-full opacity-20"
        viewBox="0 0 1200 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Circuit Lines */}
        <g className="animate-pulse">
          {/* Horizontal Lines */}
          <line x1="0" y1="100" x2="1200" y2="100" stroke="hsl(var(--primary))" strokeWidth="1" />
          <line x1="0" y1="300" x2="1200" y2="300" stroke="hsl(var(--primary))" strokeWidth="1" />
          <line x1="0" y1="500" x2="1200" y2="500" stroke="hsl(var(--primary))" strokeWidth="1" />
          <line x1="0" y1="700" x2="1200" y2="700" stroke="hsl(var(--primary))" strokeWidth="1" />
          
          {/* Vertical Lines */}
          <line x1="200" y1="0" x2="200" y2="800" stroke="hsl(var(--primary))" strokeWidth="1" />
          <line x1="400" y1="0" x2="400" y2="800" stroke="hsl(var(--primary))" strokeWidth="1" />
          <line x1="600" y1="0" x2="600" y2="800" stroke="hsl(var(--primary))" strokeWidth="1" />
          <line x1="800" y1="0" x2="800" y2="800" stroke="hsl(var(--primary))" strokeWidth="1" />
          <line x1="1000" y1="0" x2="1000" y2="800" stroke="hsl(var(--primary))" strokeWidth="1" />
          
          {/* Diagonal Connections */}
          <line x1="200" y1="100" x2="400" y2="300" stroke="hsl(var(--accent))" strokeWidth="1" />
          <line x1="400" y1="500" x2="600" y2="300" stroke="hsl(var(--accent))" strokeWidth="1" />
          <line x1="600" y1="700" x2="800" y2="500" stroke="hsl(var(--accent))" strokeWidth="1" />
          <line x1="800" y1="100" x2="1000" y2="300" stroke="hsl(var(--accent))" strokeWidth="1" />
        </g>
        
        {/* Nodes */}
        <g>
          <circle cx="200" cy="100" r="4" fill="hsl(var(--primary))" className="animate-pulse" />
          <circle cx="400" cy="300" r="4" fill="hsl(var(--primary))" className="animate-pulse delay-300" />
          <circle cx="600" cy="500" r="4" fill="hsl(var(--accent))" className="animate-pulse delay-500" />
          <circle cx="800" cy="300" r="4" fill="hsl(var(--accent))" className="animate-pulse delay-700" />
          <circle cx="1000" cy="100" r="4" fill="hsl(var(--primary))" className="animate-pulse delay-1000" />
          
          <circle cx="400" cy="100" r="3" fill="hsl(var(--primary))" className="animate-pulse delay-200" />
          <circle cx="600" cy="300" r="3" fill="hsl(var(--accent))" className="animate-pulse delay-400" />
          <circle cx="800" cy="500" r="3" fill="hsl(var(--primary))" className="animate-pulse delay-600" />
          <circle cx="200" cy="700" r="3" fill="hsl(var(--accent))" className="animate-pulse delay-800" />
        </g>
        
        {/* Animated Signals */}
        <g>
          {/* Signal 1 */}
          <circle r="3" fill="hsl(var(--primary))" className="opacity-80">
            <animateMotion dur="4s" repeatCount="indefinite">
              <path d="M 200 100 L 400 100 L 400 300 L 600 300 L 600 500" />
            </animateMotion>
          </circle>
          
          {/* Signal 2 */}
          <circle r="2" fill="hsl(var(--accent))" className="opacity-60">
            <animateMotion dur="3s" repeatCount="indefinite" begin="0.5s">
              <path d="M 1000 100 L 800 100 L 800 300 L 600 300" />
            </animateMotion>
          </circle>
          
          {/* Signal 3 */}
          <circle r="2.5" fill="hsl(var(--primary))" className="opacity-70">
            <animateMotion dur="5s" repeatCount="indefinite" begin="1s">
              <path d="M 200 700 L 400 700 L 400 500 L 600 500 L 800 500 L 1000 500" />
            </animateMotion>
          </circle>
          
          {/* Signal 4 */}
          <circle r="2" fill="hsl(var(--accent))" className="opacity-50">
            <animateMotion dur="3.5s" repeatCount="indefinite" begin="1.5s">
              <path d="M 800 700 L 800 500 L 600 500 L 600 300 L 400 300" />
            </animateMotion>
          </circle>
        </g>
      </svg>
      
      {/* Floating Particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>
      
      {/* Neural Network Connections */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-accent/40 rounded-full animate-ping" />
      <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-primary/40 rounded-full animate-ping delay-1000" />
      <div className="absolute bottom-1/3 left-1/2 w-1 h-1 bg-accent/30 rounded-full animate-ping delay-2000" />
    </div>
  );
};