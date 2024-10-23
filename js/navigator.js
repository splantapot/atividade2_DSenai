function toggleVisibility(now, end) {
    const nowMenu = document.getElementById(now);
    const endMenu = document.getElementById(end);

    nowMenu.classList.toggle('hide');
    endMenu.classList.toggle('hide');
}