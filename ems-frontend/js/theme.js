
function toggleTheme(mode) {
    if(mode === 'light') { document.body.classList.add('light-mode'); localStorage.setItem('theme', 'light'); }
    else { document.body.classList.remove('light-mode'); localStorage.setItem('theme', 'dark'); }
    
    const suns = document.querySelectorAll('.fa-sun');
    const moons = document.querySelectorAll('.fa-moon');
    suns.forEach(s => { if(mode === 'light') s.parentElement.classList.add('active'); else s.parentElement.classList.remove('active'); });
    moons.forEach(m => { if(mode === 'dark') m.parentElement.classList.add('active'); else m.parentElement.classList.remove('active'); });
}

document.addEventListener('DOMContentLoaded', () => {
    const saved = localStorage.getItem('theme') || 'dark';
    toggleTheme(saved);
    
    document.querySelectorAll('.fa-sun').forEach(s => s.parentElement.onclick = () => toggleTheme('light'));
    document.querySelectorAll('.fa-moon').forEach(m => m.parentElement.onclick = () => toggleTheme('dark'));
});
