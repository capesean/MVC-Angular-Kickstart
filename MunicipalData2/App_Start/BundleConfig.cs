using System.Web.Optimization;

namespace WEB
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            //BundleTable.EnableOptimizations = false;

            bundles.Add(new ScriptBundle("~/scripts/login").Include(
                "~/scripts/jquery-2.2.3.js",
                "~/scripts/toastr.min.js"
                ));

            bundles.Add(new ScriptBundle("~/scripts/main").Include(
                // ----- 3RD PARTY
                "~/scripts/moment.js",
                "~/scripts/jquery-2.2.3.js",
                "~/scripts/jquery-ui.min.js",
                "~/scripts/angular.js",
                "~/scripts/angular-ui-router.js",
                "~/scripts/angular-resource.js",
                //"~/scripts/angular-sanitize.js",
                "~/scripts/angular-local-storage.js",
                //"~/scripts/fullcalendar.min.js",
                //"~/scripts/calendar.js",
                "~/scripts/bootstrap.js",
                "~/scripts/DataTables/jquery.dataTables.min.js",
                "~/scripts/DataTables/dataTables.bootstrap.js",
                "~/scripts/toastr.min.js",
                "~/scripts/angular-ui/ui-bootstrap.js",
                "~/scripts/angular-ui/ui-bootstrap-tpls.js",
                "~/scripts/angular-messages.min.js",
                "~/scripts/angular-breadcrumb.min.js",
                //"~/scripts/nya-bs-select.min.js",
                "~/scripts/metisMenu.js",
                //"~/scripts/angular-ui/sortable.js",
                // ----- COMMON
                "~/app/common/app.js",
                "~/app/common/api.js",
                "~/app/common/filters.js",
                "~/app/common/masterpagecontroller.js",
                "~/app/common/ixtimedisplay.js",
                "~/app/common/ixhasrole.js",
                "~/app/common/ixlocaldate.js",
                "~/app/common/ixtimepicker.js",
                "~/app/common/authservice.js",
                "~/app/common/pinservice.js",
                "~/app/common/errorservice.js",
                "~/app/common/datepicker-popup.js",
                "~/app/common/checklist-model.js",
                // ----- LOGIN
                "~/app/login/login.js",
                "~/app/login/resetpassword.js",
                "~/app/login/passwordreset.js",
                // ----- APP
                "~/app/home/home.js",
                "~/app/settings/settings.js",
                "~/app/users/user.js",
                "~/app/users/users.js",
                // ----- OTHER
                "~/scripts/sb-admin-2.js"
                ));

            bundles.Add(new StyleBundle("~/content/login").Include(
                "~/content/bootstrap.min.css",
                "~/content/bootstrap-theme.min.css",
                "~/content/site.css",
                "~/content/toastr.min.css",
                "~/content/font-awesome.min.css.css"
                ));

            bundles.Add(new StyleBundle("~/content/main").Include(
                "~/content/bootstrap.min.css",
                "~/content/bootstrap-theme.min.css",
                "~/content/sb-admin-2.css",
                "~/content/DataTables-1.10.4/css/dataTables.bootstrap.css",
                "~/content/site.css",
                //"~/content/fullcalendar.css",
                "~/content/toastr.min.css",
                "~/content/font-awesome.min.css",
                //"~/content/nya-bs-select.min.css",
                "~/content/metisMenu.min.css"
                ));


        }
    }
}
