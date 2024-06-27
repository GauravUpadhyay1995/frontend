import React from 'react'

const FileHandling = ({files,name,seterrors,errors}) => {
    if (files && files.length > 0) {
        const file = files[0];
        const fileType = file.type;
        if (!['application/pdf', 'image/jpeg'].includes(fileType)) {
            seterrors({ ...errors, [name.toLowerCase()]: 'Invalid file type. Only PDF and JPEG are allowed.' });
            return true
        } else {
            const newErrors = { ...errors };
            delete newErrors[name.toLowerCase()];
            seterrors(newErrors);
        }
    }
  return true
}

export default FileHandling
