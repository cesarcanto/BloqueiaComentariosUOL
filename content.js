function hideComments() {
  const comments = document.querySelector('.idUs8iJ-');
  if (comments) {
    comments.style.display = 'none';
    console.log('Comentários do UOL ocultados');
    return true;
  }
  return false;
}

// tenta imediatamente
if (!hideComments()) {
  const observer = new MutationObserver(() => {
    if (hideComments()) {
      observer.disconnect();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}
