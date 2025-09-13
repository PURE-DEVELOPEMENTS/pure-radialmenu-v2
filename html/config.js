const Config = {
  mainMenu: {
      segments: [
          {
              label: "Контрабанда",
              icon: "./icons/menuicons/contraband.png",
              hasSubmenu: true,
              submenu: "contrabands"
          },
          {
              label: "Работа",
              icon: "./icons/menuicons/checkcard.png",
              hasSubmenu: true,
              submenu: "Job"
          },
          {
              label: "Емоции",
              icon: "./icons/menuicons/tempemotes.png",
              hasSubmenu: true,
              submenu: "emotes"
          },
          {
              label: "Оправи Герой",
              icon: "./icons/menuicons/clothing_generic_outfit.png",
              hasSubmenu: false,
              action: "command:loadskin"
          },
          {
              label: "Каруца",
              icon: "./icons/menuicons/call_wagon.png",
              hasSubmenu: true,
              submenu: "wagon"
          },
          {
              label: "Кон",
              icon: "./icons/menuicons/horseicon.png",
              hasSubmenu: true,
              submenu: "horse"
          },
          {
              label: "Оръжие",
              icon: "./icons/menuicons/revolver.png",
              hasSubmenu: true,
              submenu: "weapons"
          }
      ]
  },
  subMenus: {
      contrabands: {
          segments: [
              {
                  label: "Продай Контрабанда",
                  icon: "./icons/menuicons/sell.png",
                  action: "command:sellcontraband"
              },
              {
                  label: "Назад",
                  icon: "./icons/menuicons/back.png",
                  returnTo: "mainMenu"
              }
          ]
      },
      emotes: {
          segments: [
              {
                  label: "Пози",
                  icon: "./icons/menuicons/flex.png",
                  action: "command:submenu1"
              },
              {
                  label: "Вулгарни",
                  icon: "./icons/menuicons/rude.png",
                  action: "command:submenu2"
              },
              {
                  label: "Забавни",
                  icon: "./icons/menuicons/laugh.png",
                  action: "command:submenu3"
              },
              {
                  label: "Намеци",
                  icon: "./icons/menuicons/come.png",
                  action: "command:submenu4"
              },
              {
                  label: "Други 1",
                  icon: "./icons/menuicons/other1.png",
                  action: "command:submenu5"
              },
              {
                  label: "Други 2",
                  icon: "./icons/menuicons/other2.png",
                  action: "command:submenu6"
              },
              {
                  label: "Танци",
                  icon: "./icons/menuicons/dance.png",
                  action: "command:submenu7"
              },
              {
                  label: "Спри",
                  icon: "./icons/menuicons/stop.png",
                  action: "command:cancelemote"
              },
              {
                  label: "Назад",
                  icon: "./icons/menuicons/back.png",
                  returnTo: "mainMenu"
              }
          ]
      },
      wagon: {
          segments: [
              {
                  label: "Повикай Каруца",
                  icon: "./icons/menuicons/call_wagon.png",
                  action: "command:callWagon"
              },
              {
                  label: "Отпрати Каруца",
                  icon: "./icons/menuicons/wagon-back.png",
                  action: "command:fleeWagon"
              },
              {
                  label: "Оправи Каруца",
                  icon: "./icons/menuicons/wagon-fix.png",
                  action: "command:fixWagon"
              },
              {
                  label: "Назад",
                  icon: "./icons/menuicons/back.png",
                  returnTo: "mainMenu"
              }
          ]
      },
      horse: {
          segments: [
              {
                  label: "Странично Яздене",
                  icon: "./icons/menuicons/saddle.png",
                  action: "command:sidesaddle"
              },
              {
                  label: "Отпрати Кон",
                  icon: "./icons/menuicons/slap.png",
                  action: "command:fleeHorse"
              },
              {
                  label: "Почисти Кон",
                  icon: "./icons/menuicons/wagon-fix.png",
                  action: "command:reloadHorse"
              },
              {
                  label: "Назад",
                  icon: "./icons/menuicons/back.png",
                  returnTo: "mainMenu"
              }
          ]
      },
      weapons: {
          segments: [
              {
                  label: "Почисти Оръжие",
                  icon: "./icons/menuicons/wagon-fix.png",
                  action: "rsg-weapons:server:LoadComponents"
              },
              {
                  label: "Прегледай Оръжие",
                  icon: "./icons/menuicons/inspect.png",
                  action: "command:inspect"
              },
              {
                  label: "Назад",
                  icon: "./icons/menuicons/back.png",
                  returnTo: "mainMenu"
              }
          ]
      }
  },
  jobSegments: {
      police: [
        {
              label: "Провери за Барут",
              icon: "./icons/menuicons/barut.png",
              action: "command:checkgun"
        },
        {
              label: "Спешнен Сигнал",
              icon: "./icons/menuicons/sheriff.png",
              action: "pure-radialmenu:client:SendLawmanEmergencyAlert"
        },
        {
              label: "Претърси Човек",
              icon: "./icons/menuicons/search.png",
              action: "police:client:SearchPlayer"
        },
        {
            label: "Покажи значка",
            icon: "./icons/menuicons/badge.png",
            action: "menu:id:get"
        },
        {
                label: "Виж Значка",
                icon: "./icons/menuicons/badge.png",
                action: "menu:id:start"
        },
        {
              label: "Назад",
              icon: "./icons/menuicons/back.png",
              returnTo: "mainMenu"
        }
      ],
      policebusy: [
        {
            label: "Провери за Барут",
            icon: "./icons/menuicons/barut.png",
            action: "police:client:CheckStatus"
        },
        {
            label: "Спешнен Сигнал",
            icon: "./icons/menuicons/sheriff.png",
            action: "pure-radialmenu:client:SendLawmanEmergencyAlert"
        },
        {
            label: "Претърси Човек",
            icon: "./icons/menuicons/search.png",
            action: "police:client:SearchPlayer"
        },
        {
            label: "Покажи значка",
            icon: "./icons/menuicons/badge.png",
            action: "menu:id:get"
        },
        {
            label: "Виж Значка",
            icon: "./icons/menuicons/badge.png",
            action: "menu:id:start"
        },
        {
            label: "Назад",
            icon: "./icons/menuicons/back.png",
            returnTo: "mainMenu"
        }
    ],
      medic: [
          {
              label: "Излекувай",
              icon: "./icons/menuicons/med.png",
              action: "rsg-medic:client:RevivePlayer"
          },
          {
              label: "Вдига(т)",
              icon: "./icons/menuicons/inspect.png",
              action: "command:me Помага му да стане..."
          },
          {
              label: "Бинт(т)",
              icon: "./icons/menuicons/inspect.png",
              action: "command:me Бинтова раната..."
          },
          {
              label: "С.Масаж(т)",
              icon: "./icons/menuicons/inspect.png",
              action: "command:me Прави сърдечен масаж..."
          },
          {
              label: "Зашива(т)",
              icon: "./icons/menuicons/inspect.png",
              action: "command:me Зашива раната..."
          },
          {
              label: "Промива(т)",
              icon: "./icons/menuicons/inspect.png",
              action: "command:me Промива Раната..."
          },
          {
              label: "Куршум(т)",
              icon: "./icons/menuicons/inspect.png",
              action: "command:me Изважда куршум..."
          },
          {
              label: "Морфин(т)",
              icon: "./icons/menuicons/inspect.png",
              action: "command:me Бие Морфин..."
          },
          {
              label: "Преглежда(т)",
              icon: "./icons/menuicons/inspect.png",
              action: "command:me Преглежда Пациент..."
          },
          {
              label: "Пулс(т)",
              icon: "./icons/menuicons/inspect.png",
              action: "command:me Проверява за пулс..."
          },
          {
              label: "Спешнен Сигнал",
              icon: "./icons/menuicons/sheriff.png",
              action: "pure-radialmenu:client:SendLawmanEmergencyAlert"
          },
          {
              label: "Назад",
              icon: "./icons/menuicons/back.png",
              returnTo: "mainMenu"
          }
      ]
  }
};