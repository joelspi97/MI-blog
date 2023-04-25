(function() {
  const blogForm = document.getElementById('blog-form');
  if (blogForm == null) {
    return; // Exit the script in case blogForm is not being rendered 
  }

  // Form Validation - check if the image user is trying to upload finished loading 
  const submitButton = document.getElementById('submit-button');
  let filepondFinishedUploading = true;
  
  document.addEventListener('FilePond:addfilestart', e => {
    filepondFinishedUploading = false;
    submitButton.setAttribute('aria-disabled', 'true');
  });
  
  document.addEventListener('FilePond:addfile', e => {
    filepondFinishedUploading = true;
    submitButton.removeAttribute('aria-disabled');
  });
  // Form Validation - check if the image user is trying to upload finished loading 
  
  // Form Validation - check max characters 
  let isMaxErrorVisible = false;
  
  function checkMaxCharacters() {
    if (this.value.length >= 35 && !isMaxErrorVisible) { // Create error sign 
      const RED = '#b50000';
  
      this.style.borderColor = RED;
      this.style.outlineColor = RED;
  
      const errorMessage = document.createElement('div');
      errorMessage.setAttribute('aria-live', 'assertive');
      errorMessage.style.bottom = '-2rem';
      errorMessage.style.color = RED;
      errorMessage.style.position = 'absolute';
      errorMessage.append('Please, type less than 35 characters');
      this.parentNode.append(errorMessage);
  
      isMaxErrorVisible = true;
    } else if (this.value.length < 35) { // Remove error sign 
      const errorMessage = this.parentNode.querySelector('div');
  
      if (errorMessage) {
        this.style.removeProperty('outline-color');
        this.style.removeProperty('border-color');
        
        errorMessage.remove();
      }
  
      isMaxErrorVisible = false;
    }
  }
  
  const textFieldsMax = Array.from(document.querySelectorAll('.text-field-check-max'));
  textFieldsMax.forEach(field => field.addEventListener('keydown', checkMaxCharacters));
  textFieldsMax.forEach(field => field.addEventListener('keyup', checkMaxCharacters));
  // Form Validation - check max characters 
  
  // Form Submit - check if it should make a POST or a PUT request 
  const textFieldsRequired = Array.from(document.querySelectorAll('.text-field-check-required'));
  
  function handleSubmit(e) {
    e.preventDefault();
  
    // Form Validation 
    if (!filepondFinishedUploading) { // Check if filepond finished uploading the image file 
      alert('Please wait for the image to finish uploading.');
      return;
    }
    
    // Check if required fields have been populated  
    const fieldsLongerThanMaximum = textFieldsMax.some(field => field.value.length >= 35);
    const fieldsNotFilled = textFieldsRequired.some(field => field.value.length === 0);
  
    if (fieldsNotFilled || fieldsLongerThanMaximum) {
      alert('Please, fill out all the required fields and keep to the maximum number of characters to continue.');
      return;
    }
    // /Form Validation 
    
    const id = document.getElementById('id').value;
  
    if (id) { // If there's an existing id, it's going to edit the blog that has it 
      blogForm.setAttribute('action', '/selected-blog?_method=PUT');
    } else { // Otherwise, is going to create a new one 
      blogForm.setAttribute('action', '/blogs');
    }
    
    blogForm.submit();
  }
  
  blogForm.addEventListener('submit', (e) => handleSubmit(e));
  // Form Submit - check if it should make a POST or a PUT request 
})();