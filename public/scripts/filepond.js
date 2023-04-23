FilePond.registerPlugin(
  FilePondPluginImagePreview,
  FilePondPluginImageResize,
  FilePondPluginFileEncode,
)

FilePond.setOptions({
  stylePanelAspectRatio: 100/100,
  imageResizeTargetWidth: 700,
  imageResizeTargetHeight: 700
})

FilePond.parse(document.body);
