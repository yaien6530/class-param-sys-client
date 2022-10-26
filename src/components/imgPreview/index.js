import ImgPreviewComponent from './ImgPreview';

const ImgPreview = {};

ImgPreview.install = Vue => {
  const ImgConstructor = Vue.extend(ImgPreviewComponent);

  const instance = new ImgConstructor();

  instance.$mount(document.createElement('div'));

  document.body.appendChild(instance.$el);

  Vue.prototype.$imgPreview = (e) => {
    instance.target = e.currentTarget;
    instance.imgs = instance.target.getAttribute('data-img').split(',');
    instance.isShowImageDialog = true;
  };
};

export default ImgPreview;
