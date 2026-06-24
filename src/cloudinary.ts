const CLOUD_NAME = "dpisep2o5";

export function cloudinaryUrl(publicId: string, width?: number) {
  const transforms = width ? `f_auto,q_auto,w_${width}` : "f_auto,q_auto";
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transforms}/${publicId}`;
}
