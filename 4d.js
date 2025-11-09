class ExcavationSite {
    constructor() {
        this.canvas = document.getElementById('excavationCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.isExcavating = false;
        this.excavationProgress = 0;
        this.artifactsFound = 0;
        this.currentArtifact = null;
        this.excavationPoints = [];
        
        this.artifacts = [
            {
                id: 'steam-bath',
                name: 'Steam Bath',
                description: 'A steam bath is a steam-filled room or steam-filled cabinet designed for the purpose of relaxation and holistic treatment.',
                period: '~2000 CE',
                significance: 'Steam baths have been formally recognized since ancient Greek and Roman times, yet variations can be found throughout the Middle East, Asia, Mesoamerica, and Northern Africa.The Greeks developed early vapor baths called laconica in Sparta, while the Roman variation was referred to as thermae.',
                excavationRequired: 100,
                civilization: 'Ancient Rome',
                discovered: false
            },
            {
                id: 'automated-temple-doors',
                name: 'Automated Temple Doors',
                description: 'The liquid within the vessel (probably water, but Heron also thought about quicksilver) would get pushed through a hose into another vessel hanging from the ceiling and connected to the underground doorposts of the temple doors.',
                period: '~40 CE',
                significance: 'The idea was, that temple doors should open automatically when a fire is lit and close again, when the fire distinguishes. By lighting the fire above ground in an altar in front of the temple, heat would form and build up pressure into a soldered vessel beneath the temple.',
                excavationRequired: 80,
                civilization: 'Ancient Greece',
                discovered: false
            },
            {
                id: 'aeolipile',
                name: 'Aeolipile',
                description: 'An aeolipile, aeolipyle, or eolipile, also known as a Hero\'s (or Heron\'s) engine, is a simple, bladeless radial steam turbine which spins when the central water container is heated. Torque is produced by steam jets exiting the turbine.',
                period: '1 BCE',
                significance: 'The aeolipile is the first known device to transform steam into rotary motion.',
                excavationRequired: 60,
                civilization: 'Ancient Greece',
                discovered: false
            },
            {
                id: 'paper',
                name: 'Paper',
                description: 'Ancient Egyptians used steam to make papyrus which was used as paper.',
                period: '2900 BCE',
                significance: 'The ancient Egyptians grew a marsh grass called Cyperous Papyrus in the Nile river valley. The Egyptians cut thin strips from the plant’s stem and softened them in the muddy waters of the Nile. These strips were then layered in right angles to form a kind of mat.',
                excavationRequired: 40,
                civilization: 'Ancient Egypt',
                discovered: false
            },
            {
                id: 'chenglu',
                name: 'Chenglu',
                description: ' Zhang Heng invented the "chenglu," a device that used steam to spin a wheel for pleasure and ornament in ancient China.',
                period: 'Unknown',
                significance: 'The ancient Chinese used to use this as an ornament',
                excavationRequired: 20,
                civilization: 'Ancient China',
                discovered: false
            },

        ];
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.drawExcavationSite();
        this.updateStats();
    }
    
    setupEventListeners() {
        this.canvas.addEventListener('mousedown', (e) => this.startExcavation(e));
        this.canvas.addEventListener('mouseup', () => this.stopExcavation());
        this.canvas.addEventListener('mouseleave', () => this.stopExcavation());
        this.canvas.addEventListener('mousemove', (e) => this.excavate(e));
        
        this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    }
    
    drawExcavationSite() {
        const gradient = this.ctx.createRadialGradient(400, 300, 0, 400, 300, 400);
        gradient.addColorStop(0, '#D2691E');
        gradient.addColorStop(0.5, '#A0522D');
        gradient.addColorStop(1, '#8B4513');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        for (let i = 0; i < 100; i++) {
            this.ctx.fillStyle = `rgba(0, 0, 0, ${Math.random() * 0.2})`;
            this.ctx.fillRect(
                Math.random() * this.canvas.width,
                Math.random() * this.canvas.height,
                Math.random() * 20 + 5,
                Math.random() * 20 + 5
            );
        }
        
        this.excavationPoints.forEach(point => {
            this.ctx.fillStyle = '#654321';
            this.ctx.beginPath();
            this.ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }
    
    startExcavation(e) {
        if (e.button === 0) {
            this.isExcavating = true;
            this.excavate(e);
        }
    }
    
    stopExcavation() {
        this.isExcavating = false;
    }
    
    excavate(e) {
        if (!this.isExcavating) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        for (let i = 0; i < 2; i++) {
            const offsetX = (Math.random() - 0.5) * 20;
            const offsetY = (Math.random() - 0.5) * 20;
            const radius = Math.random() * 12 + 8; 
            this.excavationPoints.push({ x: x + offsetX, y: y + offsetY, radius });
        }
        
        this.createParticles(x, y);
        
        this.updateExcavationProgress();
        
        this.drawExcavationSite();
        
        this.checkForArtifacts();
    }
    
    createParticles(x, y) {
        const rect = this.canvas.getBoundingClientRect();
        for (let i = 0; i < 5; i++) {
            const particle = document.createElement('div');
            particle.className = 'excavation-particles';
            particle.style.left = (rect.left + x + (Math.random() - 0.5) * 20) + 'px';
            particle.style.top = (rect.top + y + (Math.random() - 0.5) * 20) + 'px';
            
            document.body.appendChild(particle);
            
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 1000);
        }
    }
    
    updateExcavationProgress() {
        const totalArea = this.canvas.width * this.canvas.height;
        const excavatedArea = this.excavationPoints.reduce((sum, point) => {
            return sum + (Math.PI * point.radius * point.radius);
        }, 0);
        
        this.excavationProgress = Math.min((excavatedArea / totalArea) * 100, 100);
        
        document.getElementById('progressFill').style.width = this.excavationProgress + '%';
        document.getElementById('progressText').textContent = 
            this.excavationProgress < 100 ? `Excavating... ${Math.round(this.excavationProgress)}%` : 'Site Fully Excavated!';
        
        this.updateStats();
    }
    
    checkForArtifacts() {
        this.artifacts.forEach(artifact => {
            if (!artifact.discovered && this.excavationProgress >= artifact.excavationRequired) {
                this.discoverArtifact(artifact);
            }
        });
    }
    
    discoverArtifact(artifact) {
        artifact.discovered = true;
        this.currentArtifact = artifact;
        this.artifactsFound++;
        
        this.showArtifactInfo(artifact);
        
        this.updateStats();
        
        this.highlightArtifactDiscovery();
    }
    
    showArtifactInfo(artifact) {
        document.getElementById('artifactTitle').textContent = artifact.name;
        document.getElementById('artifactImage').src = artifact.image;
        document.getElementById('artifactDescription').textContent = artifact.description;
        document.getElementById('artifactCivilization').textContent = artifact.civilization;
        document.getElementById('artifactPeriod').textContent = artifact.period;
        document.getElementById('artifactSignificance').textContent = artifact.significance;
        
        document.getElementById('artifactInfo').style.display = 'block';
    }
    
    highlightArtifactDiscovery() {
        this.ctx.strokeStyle = '#FFD700';
        this.ctx.lineWidth = 5;
        this.ctx.strokeRect(10, 10, this.canvas.width - 20, this.canvas.height - 20);
        
        for (let i = 0; i < 20; i++) {
            this.ctx.fillStyle = '#FFD700';
            this.ctx.beginPath();
            this.ctx.arc(
                Math.random() * this.canvas.width,
                Math.random() * this.canvas.height,
                Math.random() * 3 + 1,
                0,
                Math.PI * 2
            );
            this.ctx.fill();
        }
    }
    
    updateStats() {
        document.getElementById('artifactsFound').textContent = this.artifactsFound;
        document.getElementById('excavationProgress').textContent = Math.round(this.excavationProgress) + '%';
    }
}

function closeArtifactInfo() {
    document.getElementById('artifactInfo').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
    new ExcavationSite();
});