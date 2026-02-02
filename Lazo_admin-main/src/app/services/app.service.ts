import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  private search = new BehaviorSubject<any>(null);
  search$ = this.search.asObservable();
  private reload = new BehaviorSubject<boolean>(false);
  reload$ = this.search.asObservable();
  // global apis
  allCities() {
    return this.http.get(`${environment.endpoint}/cities`);
  }

  allTags() {
    return this.http.get(`${environment.endpoint}/tags`);
  }
  allBanners() {
    return this.http.get(`${environment.endpoint}/banners`);
  }
  uploadFiles(files: any) {
    const formData: any = new FormData();
    if (files.length != 0) {
      for (let i = 0; i < files.length; i++) {
        formData.append('files' + '[' + i + ']', files[i]);
      }
    }
    return this.http.post(`${environment.endpoint}/upload/files`, formData);
  }

  loadDeliveryData() {
    return this.http.get(`${environment.endpoint}/admin/delivery-periods`);
  }
  
  addDelevery(data: any) {
    return this.http.post(
      `${environment.endpoint}/admin/delivery-periods`,
      data
    );
  }
  updateDelevery(id: number, data: any) {
    return this.http.put(
      `${environment.endpoint}/admin/delivery-periods/${id}`,
      data
    );
  }
  deleteDelevery(id: any) {
    return this.http.delete(
      `${environment.endpoint}/admin/delivery-periods/${id}`
    );
  }
  // دالة لتحديث البيانات في الخدمة
  updateData(data: any) {
    this.search.next(data);
  }
  reloadData(data: any) {
    this.reload.next(data);
  }
  constructor(private http: HttpClient) {}
  showStatistics(date: any) {
    return this.http.get(
      `${environment.endpoint}/admin/statistics/show?date=${date}`
    );
  }
  // users
  users(page: any) {
    return this.http.get(
      `${environment.endpoint}/admin/clients/show?page=${page}`
    );
  }
  blockedUsers(from: any) {
    return this.http.post(
      `${environment.endpoint}/admin/manage-clients `,
      from
    );
  }
  // Add these methods to your existing AppService

  saveTermsContent(data: any) {
    return this.http.post('YOUR_API_ENDPOINT/save-terms-content', data);
  }

  saveAboutContent(data: any) {
    return this.http.post('YOUR_API_ENDPOINT/save-about-content', data);
  }

  deleteTermsContent() {
    return this.http.delete('YOUR_API_ENDPOINT/delete-terms-content');
  }

  deleteAboutContent() {
    return this.http.delete('YOUR_API_ENDPOINT/delete-about-content');
  }
  // admin
  admins() {
    return this.http.get(`${environment.endpoint}/admin/sub-admins/show`);
  }
  addAdmins(form: any) {
    const formData: any = new FormData();
    for (const [key, value] of Object.entries(form)) {
      if (value != null) {
        if (key == 'permissions') {
          for (let index = 0; index < form.permissions.length; index++) {
            formData.append(
              `permissions_ids[${index}]`,
              form.permissions[index]
            );
          }
        } else {
          formData.append(key, `${value}`);
        }
      }
    }
    return this.http.post(
      `${environment.endpoint}/admin/subadmin/add `,
      formData
    );
  }
  EditAdmins(form: any) {
    const formData: any = new FormData();
    for (const [key, value] of Object.entries(form)) {
      if (value != null) {
        if (key == 'permissions') {
          for (let index = 0; index < form.permissions.length; index++) {
            formData.append(
              `permissions_ids[${index}]`,
              form.permissions[index]
            );
          }
        } else {
          formData.append(key, `${value}`);
        }
      }
    }
    return this.http.post(
      `${environment.endpoint}/admin/subadmin/update `,
      formData
    );
  }
  deleteAdmin(id: any) {
    return this.http.delete(
      `${environment.endpoint}/admin/subadmin/delete?admin_id=${id}`
    );
  }
  toggleAdmin(from: any) {
    return this.http.post(
      `${environment.endpoint}/admin/subadmin/update `,
      from
    );
  }
  // delivery fees

  loadDeliveryFees() {
    return this.http.get(`${environment.endpoint}/admin/delivery-fees`);
  }

  // addDeliveryFees(form: any) {
  //   const formData: any = new FormData();
  //   for (const [key, value] of Object.entries(form)) {
  //     if (value != null) {
  //       formData.append(key, `${value}`);
  //     }
  //   }
  //   return this.http.post(
  //     `${environment.endpoint}/admin/delivery-fees`,
  //     formData
  //   );
  // }

  // EditDeliveryFees(id: number, form: any) {
  //   return this.http.put(
  //     `${environment.endpoint}/admin/delivery-fees/${id}`,
  //     form
  //   );
  // }

  changeDeliveryFees(form: any) {
    const formData: any = new FormData();
    for (const [key, value] of Object.entries(form)) {
      if (value != null) {
        formData.append(key, `${value}`);
      }
    }
    return this.http.post(
      `${environment.endpoint}/admin/delivery-fees`,
      formData
    );
  }

  //additional fee

  loadAdditionalFees() {
    return this.http.get(`${environment.endpoint}/admin/additional-fees`);
  }

  changeAdditionalFees(form:any) {
   const formData: any = new FormData();
    for (const [key, value] of Object.entries(form)) {
      if (value != null) {
        formData.append(key, `${value}`);
      }
    }
    return this.http.post(
      `${environment.endpoint}/admin/additional-fees`,
      formData
    );
  }
  //category

  categories() {
    return this.http.get(`${environment.endpoint}/categories`);
  }
  toggleCats(id: any) {
    return this.http.get(
      `${environment.endpoint}/admin/category/toggle?category_id=${id}`
    );
  }
  deleteCat(id: any) {
    return this.http.delete(
      `${environment.endpoint}/admin/category/delete?category_id=${id}`
    );
  }
  addCat(form: any) {
    const formData: any = new FormData();
    for (const [key, value] of Object.entries(form)) {
      if (value != null) {
        formData.append(key, `${value}`);
      }
    }
    return this.http.post(
      `${environment.endpoint}/admin/category/create `,
      formData
    );
    // /admin/category/create
  }
  EditCat(form: any) {
    const formData: any = new FormData();
    for (const [key, value] of Object.entries(form)) {
      if (value != null) {
        formData.append(key, `${value}`);
      }
    }
    return this.http.post(
      `${environment.endpoint}/admin/category/update `,
      formData
    );
    // /admin/category/create
  }
  //occasions
  occasions() {
    return this.http.get(`${environment.endpoint}/occasions`);
  }
  toggleoccasions(id: any) {
    return this.http.get(
      `${environment.endpoint}/admin/occasion/toggle?occasion_id=${id}`
    );
  }
  addOccasion(form: any) {
    const formData: any = new FormData();
    for (const [key, value] of Object.entries(form)) {
      if (value != null) {
        formData.append(key, `${value}`);
      }
    }
    return this.http.post(
      `${environment.endpoint}/admin/occasion/create `,
      formData
    );
    // /admin/category/create
  }
  EditOccasion(form: any) {
    const formData: any = new FormData();
    for (const [key, value] of Object.entries(form)) {
      if (value != null) {
        formData.append(key, `${value}`);
      }
    }
    return this.http.post(
      `${environment.endpoint}/admin/occasion/update `,
      formData
    );
    // /admin/category/create
  }
  deleteOccasion(id: any) {
    return this.http.delete(
      `${environment.endpoint}/admin/occasion/delete?occasion_id=${id}`
    );
  }
  //promo code
  promo_codes() {
    return this.http.get(`${environment.endpoint}/admin/promocode/all`);
  }
  deleteCode(id: any) {
    return this.http.delete(
      `${environment.endpoint}/admin/promocode/delete?promocode_id=${id}`
    );
  }
  addCode(form: any) {
    const formData: any = new FormData();
    for (const [key, value] of Object.entries(form)) {
      if (value != null) {
        formData.append(key, `${value}`);
      }
    }
    return this.http.post(
      `${environment.endpoint}/admin/promocode/create `,
      formData
    );
  }
  EditCode(form: any) {
    const formData: any = new FormData();
    for (const [key, value] of Object.entries(form)) {
      if (value != null) {
        formData.append(key, `${value}`);
      }
    }
    return this.http.post(
      `${environment.endpoint}/admin/promocode/update`,
      formData
    );
  }
  // files
  // clintsfils() {
  appInfo() {
    return this.http.get(`${environment.endpoint}/app-info`);
  }

  setfile(form: any) {
    const formData: any = new FormData();
    for (const [key, value] of Object.entries(form)) {
      formData.append(key, `${value}`);
    }
    return this.http.post(
      `${environment.endpoint}/admin/set/app-info`,
      formData
    );
  }

  // faq
  createFaq(form:any) {
  const formData: any = new FormData();
  formData.append('question_en', form.question_en);
  formData.append('answer_en', form.answer_en);
    formData.append('question_ar', form.question_ar);
  formData.append('answer_ar', form.answer_ar);
   return this.http.post(
      `${environment.endpoint}/admin/faq/create`,
      formData
    );
  }

  updateFaq(form:any) {
  const formData: any = new FormData();
  formData.append('faq_id', form.faq_id);
  formData.append('question_en', form.question_en);
  formData.append('answer_en', form.answer_en);
  formData.append('question_ar', form.question_ar);
  formData.append('answer_ar', form.answer_ar);
   return this.http.post(
      `${environment.endpoint}/admin/faq/update`,
      formData
    );
  }

  deleteFaq(faq_id: any) {
    return this.http.delete(
      `${environment.endpoint}/admin/faq/delete?faq_id=${faq_id}`
    );
  }

  //tags
  tags() {
    return this.http.get(`${environment.endpoint}/tags`);
  }

  addTag(form: any) {
    const formData: any = new FormData();
    for (const [key, value] of Object.entries(form)) {
      if (value != null) {
        formData.append(key, `${value}`);
      }
    }
    return this.http.post(
      `${environment.endpoint}/admin/tag/create `,
      formData
    );
    // /admin/category/create
  }

  EditTag(form: any) {
    const formData: any = new FormData();
    for (const [key, value] of Object.entries(form)) {
      if (value != null) {
        formData.append(key, `${value}`);
      }
    }
    return this.http.post(
      `${environment.endpoint}/admin/tag/update `,
      formData
    );
    // /admin/category/create
  }

  deleteTag(id: any) {
    return this.http.delete(
      `${environment.endpoint}/admin/tag/delete?tag_id=${id}`
    );
  }
  // size
  Sizes() {
    return this.http.get(`${environment.endpoint}/sizes`);
  }
  addsize(form: any) {
    const formData: any = new FormData();
    for (const [key, value] of Object.entries(form)) {
      if (value != null) {
        formData.append(key, `${value}`);
      }
    }
    return this.http.post(
      `${environment.endpoint}/admin/size/create `,
      formData
    );
    // /admin/category/create
  }
  Editsize(form: any) {
    const formData: any = new FormData();
    for (const [key, value] of Object.entries(form)) {
      if (value != null) {
        formData.append(key, `${value}`);
      }
    }
    return this.http.post(
      `${environment.endpoint}/admin/size/update `,
      formData
    );
    // /admin/category/create
  }
  deletesize(id: any) {
    return this.http.delete(
      `${environment.endpoint}/admin/size/delete?size_id=${id}`
    );
  }
  // color
  Colors() {
    return this.http.get(`${environment.endpoint}/colors`);
  }
  deleteColor(id: any) {
    return this.http.delete(
      `${environment.endpoint}/admin/color/delete?color_id=${id}`
    );
  }
  addcolor(form: any) {
    const formData: any = new FormData();
    for (const [key, value] of Object.entries(form)) {
      if (value != null) {
        formData.append(key, `${value}`);
      }
    }
    return this.http.post(
      `${environment.endpoint}/admin/color/create `,
      formData
    );
    // /admin/category/create
  }
  Editcolor(form: any) {
    const formData: any = new FormData();
    for (const [key, value] of Object.entries(form)) {
      if (value != null) {
        formData.append(key, `${value}`);
      }
    }
    return this.http.post(
      `${environment.endpoint}/admin/color/update `,
      formData
    );
    // /admin/category/create
  }
  // cards
  cards() {
    return this.http.get(`${environment.endpoint}/gift-cards`);
  }
  taps() {
    return this.http.get(`${environment.endpoint}/gift-boxes`);
  }
  togglecard_tap(type: any, id: any) {
    return this.http.get(
      `${environment.endpoint}/admin/gift-card-box/toggle?type=${type}&id=${id}`
    );
  }
  addcard(form: any) {
    const formData: any = new FormData();
    for (const [key, value] of Object.entries(form)) {
      if (value != null) {
        formData.append(key, `${value}`);
      }
    }
    return this.http.post(
      `${environment.endpoint}/admin/gift-card/create `,
      formData
    );
    // /admin/category/create
  }
  addtap(form: any) {
    const formData: any = new FormData();
    for (const [key, value] of Object.entries(form)) {
      if (value != null) {
        formData.append(key, `${value}`);
      }
    }
    return this.http.post(
      `${environment.endpoint}/admin/gift-box/create `,
      formData
    );
    // /admin/category/create
  }
  editcard(form: any, id: any) {
    const formData: any = new FormData();

    formData.append('gift_card_id', `${id}`);
    for (const [key, value] of Object.entries(form)) {
      if (value != null) {
        formData.append(key, `${value}`);
      }
    }
    return this.http.post(
      `${environment.endpoint}/admin/gift-card/update `,
      formData
    );
    // /admin/category/create
  }
  edittap(form: any, id: any) {
    const formData: any = new FormData();
    formData.append('gift_box_id', `${id}`);
    for (const [key, value] of Object.entries(form)) {
      if (value != null) {
        formData.append(key, `${value}`);
      }
    }
    return this.http.post(
      `${environment.endpoint}/admin/gift-box/update `,
      formData
    );
    // /admin/category/create
  }
  deleteCard(id: any) {
    return this.http.delete(
      `${environment.endpoint}/admin/gift-card/delete?gift_card_id=${id}`
    );
  }
  deletetap(id: any) {
    return this.http.delete(
      `${environment.endpoint}/admin/gift-box/delete?gift_box_id=${id}`
    );
  }
  // orders
  show_order(status: any, family: any, page: any, per_page: any) {
    return this.http.get(
      `${environment.endpoint}/admin/orders?status=${status}&order_family=${family}&page=${page}&per_page=${per_page}`
    );
  }
  show_order_details(id: any) {
    return this.http.get(
      `${environment.endpoint}/admin/order/show?order_id=${id}`
    );
  }
  manageOrders(form: any) {
    const formData: any = new FormData();

    for (const [key, value] of Object.entries(form)) {
      if (value != null) {
        formData.append(key, `${value}`);
      }
    }
    return this.http.post(
      `${environment.endpoint}/admin/order/manage`,
      formData
    );
    // /admin/category/create
  }
  // /admin/order/show?order_id=11
  // providers
  getProviders(status: any, family: any, page: any) {
    return this.http.get(
      `${environment.endpoint}/admin/providers/show?status=${status}&account_type=${family}&page=${page}`
    );
  }
  show_provider_details(id: any) {
    return this.http.get(
      `${environment.endpoint}/admin/provider/show?provider_id=${id}`
    );
  }
  toggleProvider(from: any) {
    return this.http.post(
      `${environment.endpoint}/admin/manage-providers`,
      from
    );
  }
  toggleProviderPromoted(from: any) {
    return this.http.post(
      `${environment.endpoint}/admin/provider/promotion`,
      from
    );
  }
  Update_app_percent(from: any) {
    return this.http.post(
      `${environment.endpoint}/admin/provider/app-percent/update`,
      from
    );
  }
  show_provider_transactions(id: any, page: any) {
    return this.http.get(
      `${environment.endpoint}/admin/provider/transactions-history?provider_id=${id}&page=${page}`
    );
  }
  make_transactions(form: any) {
    const formData: any = new FormData();
    for (const [key, value] of Object.entries(form)) {
      if (value != null) {
        formData.append(key, `${value}`);
      }
    }
    return this.http.post(
      `${environment.endpoint}/admin/transaction/make`,
      formData
    );
    // /admin/category/create
  }
  getLocationName(long: any, lat: any, accessToken: any) {
    return this.http.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${long},${lat}.json?types=poi&access_token=${accessToken}`
    );
  }
  add(form: any) {
    const formData: FormData = new FormData();

    delete form['days_hours'];

    for (const [key, value] of Object.entries(form)) {
      // ❌ Skip null, undefined, empty string
      if (value === null || value === undefined || value === '') {
        continue;
      }

      // ------------ NORMAL FIELDS (non-files, non-arrays) ------------
      if (
        !Array.isArray(value) &&
        key !== 'image' &&
        key !== 'self_employment_document' &&
        key !== 'commercial_register_image' &&
        key !== 'iban_image'
      ) {
        // special case: offline_stores_number = 0 → skip
        if (key === 'offline_stores_number' && value === 0) {
          continue;
        }

        formData.append(key, `${value}`);
        continue;
      }

      // ------------ ARRAY FIELDS ------------
      if (Array.isArray(value)) {
        if (value.length === 0) continue;

        value.forEach((item: any, index: number) => {
          if (item === null || item === '' || item === undefined) return;

          // special case: locations[]
          if (key === 'locations') {
            formData.append(`${key}[${index}]`, item.lat_lng);
            formData.append(`addresses[${index}]`, item.address);
          } else {
            formData.append(`${key}[${index}]`, item);
          }
        });

        continue;
      }
    }

    // ---------- FILES ----------
    if (form?.image) {
      formData.append('image', form.image);
    }
    if (form?.self_employment_document) {
      formData.append(
        'self_employment_document',
        form.self_employment_document
      );
    }
    if (form?.commercial_register_image) {
      formData.append(
        'commercial_register_image',
        form.commercial_register_image
      );
    }
    if (form?.iban_image) {
      formData.append('iban_image', form.iban_image);
    }

    return this.http.post(
      `${environment.endpoint}/admin/provider/add`,
      formData
    );
  }

  //banner
  addbanner(form: any) {
    const formData: any = new FormData();
    for (const [key, value] of Object.entries(form)) {
      if (value != null) {
        formData.append(key, `${value}`);
      }
    }
    return this.http.post(
      `${environment.endpoint}/admin/banner/create `,
      formData
    );
    // /admin/category/create
  }
  editbanner(form: any) {
    const formData: any = new FormData();

    for (const [key, value] of Object.entries(form)) {
      if (value != null) {
        formData.append(key, `${value}`);
      }
    }
    return this.http.post(
      `${environment.endpoint}/admin/banner/update `,
      formData
    );
    // /admin/category/create
  }
  deleteBanner(id: any) {
    return this.http.delete(
      `${environment.endpoint}/admin/banner/delete?banner_id=${id}`
    );
  }
  // city
  getAllCities() {
    return this.http.get(`${environment.endpoint}/cities`);
  }
  addCity(form: any) {
    const formData: any = new FormData();
    for (const [key, value] of Object.entries(form)) {
      if (value != null) {
        formData.append(key, `${value}`);
      }
    }
    return this.http.post(
      `${environment.endpoint}/admin/city/create `,
      formData
    );
    // /admin/category/create
  }
  editCity(form: any) {
    const formData: any = new FormData();
    for (const [key, value] of Object.entries(form)) {
      if (value != null) {
        formData.append(key, `${value}`);
      }
    }
    return this.http.post(
      `${environment.endpoint}/admin/city/update `,
      formData
    );
    // /admin/category/create
  }
  deleteCity(id: any) {
    return this.http.delete(
      `${environment.endpoint}/admin/city/delete?city_id=${id}`
    );
  }
  // country
  getAllCountries() {
    return this.http.get(`${environment.endpoint}/countries`);
  }
  addCountry(form: any) {
    const formData: any = new FormData();
    for (const [key, value] of Object.entries(form)) {
      if (value != null) {
        formData.append(key, `${value}`);
      }
    }
    return this.http.post(
      `${environment.endpoint}/admin/country/create `,
      formData
    );
  }
  editCountry(form: any) {
    const formData: any = new FormData();
    for (const [key, value] of Object.entries(form)) {
      if (value != null) {
        formData.append(key, `${value}`);
      }
    }
    return this.http.post(
      `${environment.endpoint}/admin/country/update `,
      formData
    );
  }
  deleteCountry(id: any) {
    return this.http.delete(
      `${environment.endpoint}/admin/country/delete?country_id=${id}`
    );
  }
}
