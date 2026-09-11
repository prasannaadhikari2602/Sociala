import React, { useState } from "react";

import {
  NavLink,
  Link,
  useNavigate,
} from "react-router-dom";

import { useSelector } from "react-redux";

import {
  FiHome,
  FiCompass,
  FiBell,
  FiPlus,
  FiChevronDown,
  FiUser,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
} from "react-icons/fi";

import { TbSocial } from "react-icons/tb";

import { selectCurrentUser } from "../features/auth/authSlice";

import { useLogoutUserMutation } from "../features/auth/authApi";


const UserNavbar = () => {

  // ==========================================
  // STATE
  // ==========================================

  const [open, setOpen] = useState(false);

  const [profileOpen, setProfileOpen] = useState(false);


  // ==========================================
  // CURRENT USER
  // ==========================================

  const user = useSelector(selectCurrentUser);


  // ==========================================
  // LOGOUT MUTATION
  // ==========================================

  const [logoutUser] = useLogoutUserMutation();


  // ==========================================
  // NAVIGATION
  // ==========================================

  const navigate = useNavigate();


  // ==========================================
  // NAVIGATION LINKS
  // ==========================================

  const navLinks = [
    {
      name: "Feed",
      path: "/feed",
      icon: <FiHome size={17} />,
    },

    {
      name: "Explore",
      path: "/userExplore",
      icon: <FiCompass size={17} />,
    },
  ];


  // ==========================================
  // CLOSE MENUS
  // ==========================================

  const closeMenu = () => {
    setOpen(false);
    setProfileOpen(false);
  };


  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = async () => {

    try {

      await logoutUser().unwrap();

    } catch (error) {

      console.error("Logout error:", error);

    } finally {

      navigate("/login", {
        replace: true,
      });

    }
  };


  // ==========================================
  // USER NAME
  // ==========================================

  const userName =
    user?.name ||
    user?.username ||
    "User";


  // ==========================================
  // USERNAME
  // ==========================================

  const username =
    user?.username
      ? `@${user.username}`
      : user?.email || "";


  // ==========================================
  // GET USER INITIALS
  // ==========================================

  const getInitials = () => {

    if (user?.name) {

      const names = user.name
        .trim()
        .split(" ");

      if (names.length >= 2) {

        return (
          names[0][0] +
          names[names.length - 1][0]
        ).toUpperCase();

      }

      return names[0][0].toUpperCase();
    }


    if (user?.username) {

      return user.username
        .slice(0, 2)
        .toUpperCase();

    }


    return "U";
  };


  return (

    <header
      className="
        sticky
        top-0
        z-50
        border-b
        border-slate-200
        bg-white
      "
    >

      {/* ========================================
          MAIN NAVBAR
      ========================================= */}

      <div
        className="
          mx-auto
          flex
          h-20
          max-w-6xl
          items-center
          justify-between
          px-6
        "
      >


        {/* ======================================
            LOGO
        ======================================= */}

        <Link
          to="/feed"
          onClick={closeMenu}
          className="
            flex
            shrink-0
            items-center
            gap-2.5
          "
        >

          {/* Logo */}

          <div
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-lg
              bg-slate-900
              text-white
            "
          >

            <TbSocial size={21} />

          </div>


          {/* Brand */}

          <span
            className="
              text-xl
              font-semibold
              tracking-tight
              text-slate-900
            "
          >

            Socia

            <span className="text-blue-600">
              La
            </span>

          </span>

        </Link>



        {/* ======================================
            DESKTOP NAVIGATION
        ======================================= */}

        <nav
          className="
            hidden
            items-center
            gap-8
            md:flex
          "
        >

          {navLinks.map((link) => (

            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `
                flex
                items-center
                gap-2
                rounded-md
                px-3
                py-2
                text-sm
                transition-colors
                duration-200

                ${
                  isActive
                    ? "bg-slate-100 font-medium text-slate-900"
                    : "text-slate-500 hover:text-slate-900"
                }
                `
              }
            >

              {link.icon}

              <span>
                {link.name}
              </span>

            </NavLink>

          ))}

        </nav>



        {/* ======================================
            RIGHT SIDE
        ======================================= */}

        <div
          className="
            flex
            items-center
            gap-3
          "
        >


          {/* ====================================
              NEW POST
          ===================================== */}

          <button
            type="button"
            onClick={() => navigate("/posts")}
            className="
              hidden
              items-center
              gap-2
              rounded-md
              bg-slate-900
              px-4
              py-2.5
              text-sm
              font-medium
              text-white
              transition-colors
              hover:bg-slate-700
              sm:flex
            "
          >

            <FiPlus size={17} />

            <span>
              New Post
            </span>

          </button>



          {/* ====================================
              NOTIFICATIONS
          ===================================== */}

          <button
            type="button"
            onClick={() => navigate("/notification")}
            className="
              relative
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-md
              text-slate-500
              transition
              hover:bg-slate-100
              hover:text-slate-900
            "
            aria-label="Notifications"
          >

            <FiBell size={20} />


            {/* Notification Count */}

            <span
              className="
                absolute
                right-0.5
                top-0.5
                flex
                h-4
                min-w-4
                items-center
                justify-center
                rounded-full
                bg-blue-600
                px-1
                text-[10px]
                font-semibold
                text-white
              "
            >
              4
            </span>

          </button>



          {/* ====================================
              PROFILE
          ===================================== */}

          <div className="relative">


            {/* Profile Button */}

            <button
              type="button"
              onClick={() =>
                setProfileOpen((prev) => !prev)
              }
              className="
                flex
                items-center
                gap-2
                rounded-md
                p-1
                transition
                hover:bg-slate-100
              "
              aria-expanded={profileOpen}
            >

              {/* Avatar */}

              <div
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  bg-slate-900
                  text-xs
                  font-semibold
                  text-white
                "
              >

                {getInitials()}

              </div>


              {/* Dropdown Arrow */}

              <FiChevronDown
                size={16}
                className={`
                  hidden
                  text-slate-500
                  transition-transform
                  lg:block

                  ${
                    profileOpen
                      ? "rotate-180"
                      : ""
                  }
                `}
              />

            </button>



            {/* =================================
                PROFILE DROPDOWN
            ================================== */}

            {profileOpen && (

              <div
                className="
                  absolute
                  right-0
                  top-12
                  w-64
                  overflow-hidden
                  rounded-lg
                  border
                  border-slate-200
                  bg-white
                  shadow-lg
                "
              >


                {/* User Information */}

                <div
                  className="
                    border-b
                    border-slate-200
                    px-5
                    py-4
                  "
                >

                  <p
                    className="
                      text-sm
                      font-semibold
                      text-slate-900
                    "
                  >
                    {userName}
                  </p>


                  <p
                    className="
                      mt-1
                      text-sm
                      text-slate-500
                    "
                  >
                    {username}
                  </p>

                </div>



                {/* Profile */}

                <Link
                  to="/profile"
                  onClick={closeMenu}
                  className="
                    flex
                    items-center
                    gap-3
                    px-5
                    py-3.5
                    text-sm
                    text-slate-600
                    transition
                    hover:bg-slate-50
                    hover:text-slate-900
                  "
                >

                  <FiUser size={17} />

                  <span>
                    Profile
                  </span>

                </Link>



                {/* Settings */}

                <Link
                  to="/settings"
                  onClick={closeMenu}
                  className="
                    flex
                    items-center
                    gap-3
                    px-5
                    py-3.5
                    text-sm
                    text-slate-600
                    transition
                    hover:bg-slate-50
                    hover:text-slate-900
                  "
                >

                  <FiSettings size={17} />

                  <span>
                    Settings
                  </span>

                </Link>



                {/* Divider */}

                <div className="h-px bg-slate-200" />



                {/* Logout */}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="
                    flex
                    w-full
                    items-center
                    gap-3
                    px-5
                    py-3.5
                    text-sm
                    text-red-600
                    transition
                    hover:bg-red-50
                  "
                >

                  <FiLogOut size={17} />

                  <span>
                    Logout
                  </span>

                </button>

              </div>

            )}

          </div>



          {/* ====================================
              MOBILE MENU BUTTON
          ===================================== */}

          <button
            type="button"
            onClick={() =>
              setOpen((prev) => !prev)
            }
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-md
              text-slate-700
              transition
              hover:bg-slate-100
              md:hidden
            "
            aria-label="Toggle navigation menu"
            aria-expanded={open}
          >

            {open ? (
              <FiX size={23} />
            ) : (
              <FiMenu size={23} />
            )}

          </button>

        </div>

      </div>



      {/* ========================================
          MOBILE MENU
      ========================================= */}

      {open && (

        <div
          className="
            absolute
            left-0
            right-0
            top-20
            z-50
            border-b
            border-t
            border-slate-200
            bg-white
            shadow-lg
            md:hidden
          "
        >

          <nav
            className="
              mx-auto
              max-w-6xl
              px-6
              py-4
            "
          >


            {/* =================================
                MOBILE NAVIGATION
            ================================== */}

            <div
              className="
                flex
                flex-col
                gap-1
              "
            >

              {navLinks.map((link) => (

                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `
                    flex
                    items-center
                    gap-3
                    rounded-md
                    px-4
                    py-3
                    text-sm
                    transition-colors

                    ${
                      isActive
                        ? "bg-slate-100 font-medium text-slate-900"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                    }
                    `
                  }
                >

                  {link.icon}

                  <span>
                    {link.name}
                  </span>

                </NavLink>

              ))}

            </div>



            {/* =================================
                MOBILE NEW POST
            ================================== */}

            <button
              type="button"
              onClick={() => {

                closeMenu();

                navigate("/posts");

              }}
              className="
                mt-3
                flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-md
                bg-slate-900
                px-4
                py-3
                text-sm
                font-medium
                text-white
                transition
                hover:bg-slate-700
              "
            >

              <FiPlus size={17} />

              New Post

            </button>



            {/* Divider */}

            <div
              className="
                my-4
                h-px
                bg-slate-200
              "
            />



            {/* =================================
                MOBILE PROFILE
            ================================== */}

            <Link
              to="/profile"
              onClick={closeMenu}
              className="
                flex
                items-center
                gap-3
                rounded-md
                px-4
                py-3
                text-sm
                text-slate-600
                hover:bg-slate-50
                hover:text-slate-900
              "
            >

              <FiUser size={17} />

              Profile

            </Link>



            {/* =================================
                MOBILE NOTIFICATION
            ================================== */}

            <Link
              to="/notification"
              onClick={closeMenu}
              className="
                flex
                items-center
                gap-3
                rounded-md
                px-4
                py-3
                text-sm
                text-slate-600
                hover:bg-slate-50
                hover:text-slate-900
              "
            >

              <FiBell size={17} />

              Notification

            </Link>



            {/* =================================
                MOBILE SETTINGS
            ================================== */}

            <Link
              to="/settings"
              onClick={closeMenu}
              className="
                flex
                items-center
                gap-3
                rounded-md
                px-4
                py-3
                text-sm
                text-slate-600
                hover:bg-slate-50
                hover:text-slate-900
              "
            >

              <FiSettings size={17} />

              Settings

            </Link>



            {/* =================================
                MOBILE LOGOUT
            ================================== */}

            <button
              type="button"
              onClick={handleLogout}
              className="
                flex
                w-full
                items-center
                gap-3
                rounded-md
                px-4
                py-3
                text-sm
                text-red-600
                hover:bg-red-50
              "
            >

              <FiLogOut size={17} />

              Logout

            </button>

          </nav>

        </div>

      )}

    </header>
  );
};


export default UserNavbar;