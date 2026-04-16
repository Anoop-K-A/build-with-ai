export const analyzePlantImage = async (imageFile, weatherContext = null) => {
  const formData = new FormData();
  formData.append("image", imageFile);

  // Syncing metadata metrics into the express multimodal prompt
  if (weatherContext) {
    formData.append("temperature", weatherContext.temperature);
    formData.append("humidity", weatherContext.humidity);
    formData.append("lat", weatherContext.lat);
    formData.append("lng", weatherContext.lng);
  }

  const response = await fetch("http://localhost:5000/api/analyze", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(
      errorBody.error || errorBody.diagnosis || "Analysis failed",
    );
  }

  return response.json();
};
