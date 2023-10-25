#include <gtkmm.h>

class MyWindow : public Gtk::Window
{
  public:
    MyWindow();
  protected:
    Gtk::Button m_button;
};

MyWindow::MyWindow()
{
  set_title("Basic application");
  set_default_size(200, 200);
  m_button = Gtk::Button("Hello World!");
  set_child(m_button);
}


int main(int argc, char* argv[])
{
  auto app = Gtk::Application::create("org.gtkmm.examples.base");

  return app->make_window_and_run<MyWindow>(argc, argv);
}